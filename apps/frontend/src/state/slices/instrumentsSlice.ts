import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Instrument } from "src/types/instrument.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum INSTRUMENT_ACTIONS {
  GET_INSTRUMENTS = "instruments/getInstruments",
}

export type InstrumentItems = {
  [index:string]: { 
    [index:string]: Instrument
  } 
};

export type InstrumentsState = {
  error: string | null | undefined
  items: InstrumentItems
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
};

const initialState:InstrumentsState = {
  error: null,
  items: <InstrumentItems>{},
  status: 'idle',
};

/**
 * Get all the instruments from the PDS OpenSearch API
 */ 
export const getInstruments = createAsyncThunk(
  INSTRUMENT_ACTIONS.GET_INSTRUMENTS,
  async (_:void, thunkAPI) => {
    
    const username = import.meta.env.VITE_OPENSEARCH_USERNAME;
    const password = import.meta.env.VITE_OPENSEARCH_PASSWORD;
    const url = import.meta.env.VITE_OPENSEARCH_DOMAIN + import.meta.env.VITE_OPENSEARCH_INDEX_REGISTRY + "/_search";
    
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Basic " + btoa(username + ":" + password)
    }
    
    // Set up query
    const query = {
      "from": 0,
      "size": 9999, // we must provide a size otherwise we only receive a limited number of results
      "query": {
        "wildcard": {
          [PDS4_INFO_MODEL.LID]: {
            "value": "urn:*:instrument:*"
          }
        }
      },
      "_source": {
        "includes": [
          PDS4_INFO_MODEL.LID,
          PDS4_INFO_MODEL.LIDVID,
          PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST,
          PDS4_INFO_MODEL.TITLE,
          PDS4_INFO_MODEL.VID,
          PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE,
          PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION,
          PDS4_INFO_MODEL.INSTRUMENT.NAME,
          PDS4_INFO_MODEL.INSTRUMENT.TYPE
        ]
      }
    };
    
    try {
      const response = await axios.post(url, query, {headers: headers})
      return response.data
    } catch (err:any) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
    
  }
);

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getInstruments.pending, (state, _action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getInstruments.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      
      // Store the fetched data into the state after parsing
      const data = action.payload.hits.hits;

      let compiledItems:InstrumentItems = {};
      data.forEach( (element:{_source:object}) => {

        const source:Instrument = <Instrument>element["_source"];

        const lid = source[PDS4_INFO_MODEL.LID];
        const vid = source[PDS4_INFO_MODEL.VID];

        let instrument:Instrument = <Instrument>{};
        instrument[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID];
        instrument[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID];
        instrument[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST] = source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST];
        instrument[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE];
        instrument[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID];
        instrument[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE] = source[PDS4_INFO_MODEL.CTLI_TYPE_LIST.TYPE];
        instrument[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION] = source[PDS4_INFO_MODEL.INSTRUMENT.DESCRIPTION];
        instrument[PDS4_INFO_MODEL.INSTRUMENT.NAME] = source[PDS4_INFO_MODEL.INSTRUMENT.NAME];
        instrument[PDS4_INFO_MODEL.INSTRUMENT.TYPE] = source[PDS4_INFO_MODEL.INSTRUMENT.TYPE];

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

export default instrumentsSlice.reducer;