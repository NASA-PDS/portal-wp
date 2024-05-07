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
 * Get all the instrument hosts from the PDS OpenSearch API
 */ 
export const getInstrumentHosts = createAsyncThunk(
  INSTRUMENT_HOST_ACTIONS.GET_INSTRUMENT_HOSTS,
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
            "value": "urn:*:instrument_host:*"
          }
        }
      },
      "_source": {
        "includes": [
          PDS4_INFO_MODEL.LID,
          PDS4_INFO_MODEL.LIDVID,
          PDS4_INFO_MODEL.REF_LID_INSTRUMENT,
          PDS4_INFO_MODEL.REF_LID_TARGET,
          PDS4_INFO_MODEL.TITLE,
          PDS4_INFO_MODEL.VID,
          PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE,
          PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION,
          PDS4_INFO_MODEL.INSTRUMENT_HOST.TYPE
        ]
      }
    };
    
    try {
      const response = await axios.post(url, query, {headers: headers})
      return response.data
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
      const data = action.payload.hits.hits;

      const compiledItems:InstrumentHostItems = {};
      data.forEach( (element:{_source:object}) => {

        const source:InstrumentHost = <InstrumentHost>element["_source"];

        const lid = source[PDS4_INFO_MODEL.LID];
        const vid = source[PDS4_INFO_MODEL.VID];

        const instrumentHost:InstrumentHost = <InstrumentHost>{};
        instrumentHost[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID];
        instrumentHost[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID];
        instrumentHost[PDS4_INFO_MODEL.REF_LID_INSTRUMENT] = source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT];
        instrumentHost[PDS4_INFO_MODEL.REF_LID_TARGET] = source[PDS4_INFO_MODEL.REF_LID_TARGET];
        instrumentHost[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID];
        instrumentHost[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE];
        instrumentHost[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE] = source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toString();
        instrumentHost[PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION] = source[PDS4_INFO_MODEL.INSTRUMENT_HOST.DESCRIPTION].toString();
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