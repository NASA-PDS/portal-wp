import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { Instrument, INSTRUMENT_TYPE } from "src/types/instrument.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum INSTRUMENT_ACTIONS {
  GET_INSTRUMENTS = "instruments/getInstruments",
}

export type InstrumentItems = {
  [index:string]: { 
    [index:string]: Instrument
  } 
};

export type InstrumentDirectorySearchFilterState = {
  freeText:string,
  type:INSTRUMENT_TYPE,
}

export type InstrumentsState = {
  error: string | null | undefined
  items: InstrumentItems
  searchFilters: InstrumentDirectorySearchFilterState | undefined
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
};

const initialState:InstrumentsState = {
  error: null,
  items: <InstrumentItems>{},
  searchFilters: undefined,
  status: 'idle',
};

/**
 * Get all the instruments from the PDS Search API
 */ 
export const getInstruments = createAsyncThunk(
  INSTRUMENT_ACTIONS.GET_INSTRUMENTS,
  async (_:void, thunkAPI) => {

    let queryUrl = '/api/search/1/products?q=(';
    queryUrl    += 'product_class eq "Product_Context" AND ('
    queryUrl    += 'lid LIKE "urn:nasa:pds:context:instrument:*" ';
    queryUrl    += 'OR lid LIKE "urn:esa:psa:context:instrument:*" ';
    queryUrl    += 'OR lid LIKE "urn:jaxa:darts:context:instrument:*" ';
    queryUrl    += 'OR lid LIKE "urn:isro:isda:context:instrument:*" ';
    queryUrl    += 'OR lid LIKE "urn:kari:kpds:context:instrument:*")';
    queryUrl    += ')&limit=9999';

    const config = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    };
    
    const fields = [
      PDS4_INFO_MODEL.LID,
      PDS4_INFO_MODEL.LIDVID,
      PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST,
      PDS4_INFO_MODEL.TITLE,
      PDS4_INFO_MODEL.VID,
      PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION,
      PDS4_INFO_MODEL.INSTRUMENT.NAME,
      PDS4_INFO_MODEL.INSTRUMENT.TYPE
    ];

    // Add the specific fields that should be returned
    queryUrl += "&fields=";
    fields.forEach( (field, index) => {
      queryUrl += field;
      queryUrl += index < fields.length - 1 ? "," : "";
    });

    if( import.meta.env.DEV ) {
      // Output query URL to help with debugging only in DEV mode
      console.info("Instruments API Query: ", queryUrl)
    }
    
    try {
      const response = await axios.get(queryUrl, config);
      return response.data;
    } catch (err:unknown) {
      if( err instanceof Error ) {
        return thunkAPI.rejectWithValue({ error: err.message });
      }
    }
    
  }
);

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {
    setFreeTextSearchFilter: (state, action:PayloadAction<string>) => {
      if( state.searchFilters === undefined ) {
        state.searchFilters = <InstrumentDirectorySearchFilterState>{}
      }
      state.searchFilters.freeText = action.payload;
    },
    setInstrumentTypeSearchFilter: (state, action:PayloadAction<INSTRUMENT_TYPE>) => {
      if( state.searchFilters === undefined ) {
        state.searchFilters = <InstrumentDirectorySearchFilterState>{}
      }
      state.searchFilters.type = action.payload;
    }
  },
  extraReducers: (builder) => {
    
    builder.addCase(getInstruments.pending, (state, _action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getInstruments.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      
      // Store the fetched data into the state after parsing
      const data = action.payload.data;

      const compiledItems:InstrumentItems = {};
      data.forEach( (element:{"summary":object, "properties":object}) => {

        const source:Instrument = <Instrument>element["properties"];

        const lid = source[PDS4_INFO_MODEL.LID][0];
        const vid = source[PDS4_INFO_MODEL.VID][0];

        const instrument:Instrument = <Instrument>{};
        instrument[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID][0];
        instrument[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID][0];
        instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST] = source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST];
        instrument[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE][0];
        instrument[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID][0];
        instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION] = source[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION] ? source[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION][0] : "";
        instrument[PDS4_INFO_MODEL.INSTRUMENT.NAME] = source[PDS4_INFO_MODEL.INSTRUMENT.NAME] ? source[PDS4_INFO_MODEL.INSTRUMENT.NAME][0] : "";
        instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE] = source[PDS4_INFO_MODEL.INSTRUMENT.TYPE] ? source[PDS4_INFO_MODEL.INSTRUMENT.TYPE] : [];

        if( compiledItems[lid] === undefined ) {
          compiledItems[lid] = {};
        }

        compiledItems[lid][vid] = instrument;

      });
      
      state.items = compiledItems;

    });
    
    builder.addCase(getInstruments.rejected, (state, action) => {
      // When data is fetched unsuccessfully
      state.status = "failed";
      
      // Update the error message for proper error handling
      state.error = action.error.message;
    });
    
  }
});

export const { setFreeTextSearchFilter, setInstrumentTypeSearchFilter } = instrumentsSlice.actions;
export default instrumentsSlice.reducer;