import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { InstrumentHost } from "src/types/instrumentHost.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum INSTRUMENT_HOST_ACTIONS {
  GET_INSTRUMENT_HOSTS = "instrumentHosts/getInstrumentHosts",
}

export type InstrumentHostItems = {
  [index:string]: { 
    [index:string]: InstrumentHost
  } 
};

export type InstrumentHostsState = {
  error: string | null | undefined
  items: InstrumentHostItems
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
};

const initialState:InstrumentHostsState = {
  error: null,
  items: <InstrumentHostItems>{},
  status: 'idle',
};

/**
 * Get all the instrument hosts from the PDS Search API
 */ 
export const getInstrumentHosts = createAsyncThunk(
  INSTRUMENT_HOST_ACTIONS.GET_INSTRUMENT_HOSTS,
  async (_:void, thunkAPI) => {
    
    let queryUrl = '/api/search/1/products?q=(product_class eq "Product_Context" and lid like "urn:nasa:pds:context:instrument_host:*")&limit=9999'
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };
    
    const fields = [
      PDS4_INFO_MODEL.LID,
      PDS4_INFO_MODEL.LIDVID,
      PDS4_INFO_MODEL.REF_LID_INSTRUMENT,
      PDS4_INFO_MODEL.REF_LID_TARGET,
      PDS4_INFO_MODEL.TITLE,
      PDS4_INFO_MODEL.VID,
      PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE,
      PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION,
      PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME,
      PDS4_INFO_MODEL.INSTRUMENT_HOST.TYPE
    ];

    // Add the specific fields that should be returned
    queryUrl += "&fields=";
    fields.forEach( (field, index) => {
      queryUrl += field;
      queryUrl += index < fields.length - 1 ? "," : "";
    });

    if( import.meta.env.DEV ) {
      // Output query URL to help with debugging only in DEV mode
      console.info("Instrument Hosts API Query: ", queryUrl)
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

const instrumentHostsSlice = createSlice({
  name: "instrumentHosts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getInstrumentHosts.pending, (state, _action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getInstrumentHosts.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      
      // Store the fetched data into the state after parsing
      const data = action.payload.data;

      const compiledItems:InstrumentHostItems = {};
      data.forEach( (element:{"summary":object, "properties":object}) => {

        const source:InstrumentHost = <InstrumentHost>element["properties"];

        const lid = source[PDS4_INFO_MODEL.LID][0];
        const vid = source[PDS4_INFO_MODEL.VID][0];

        const instrumentHost:InstrumentHost = <InstrumentHost>{};
        instrumentHost[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID][0];
        instrumentHost[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID][0];
        instrumentHost[PDS4_INFO_MODEL.REF_LID_INSTRUMENT] = source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT];
        instrumentHost[PDS4_INFO_MODEL.REF_LID_TARGET] = source[PDS4_INFO_MODEL.REF_LID_TARGET];
        instrumentHost[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID][0];
        instrumentHost[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE][0];
        instrumentHost[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE] = source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE] ? source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE][0] : "";
        instrumentHost[PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION] = source[PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION] ? source[PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION][0] : "";
        instrumentHost[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME] = source[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME] ? source[PDS4_INFO_MODEL.INSTRUMENT_HOST.NAME][0] : ""
        instrumentHost[PDS4_INFO_MODEL.INSTRUMENT_HOST.TYPE] = source[PDS4_INFO_MODEL.INSTRUMENT_HOST.TYPE].toString();

        if( compiledItems[lid] === undefined ) {
          compiledItems[lid] = {};
        }

        compiledItems[lid][vid] = instrumentHost;

      });
      
      state.items = compiledItems;

    });
    
    builder.addCase(getInstrumentHosts.rejected, (state, action) => {
      // When data is fetched unsuccessfully
      state.status = "failed";
      
      // Update the error message for proper error handling
      state.error = action.error.message;
    });
    
  }
});

export default instrumentHostsSlice.reducer;