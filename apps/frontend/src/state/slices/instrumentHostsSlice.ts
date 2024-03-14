import axios from 'axios';
import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

import { InstrumentHost } from "src/types/instrumentHost.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";
import { RootState } from '../store';

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
          PDS4_INFO_MODEL.VID,
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

      let compiledItems:InstrumentHostItems = {};
      data.forEach( (element:{_source:object}) => {

        const source:InstrumentHost = <InstrumentHost>element["_source"];

        const lid = source[PDS4_INFO_MODEL.LID];
        const vid = source[PDS4_INFO_MODEL.VID];

        let instrumentHost:InstrumentHost = <InstrumentHost>{};
        instrumentHost[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID];
        instrumentHost[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID];
        instrumentHost[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID];
        instrumentHost[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE];

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

/**
 * A redux selector to efficiently retrieve a list of the latest instrument hosts.
 * @param {InstrumentHostsState} state The instrument hosts redux state of type InstrumentHostsState
 * @returns {InstrumentHost[]} An array containing the list of the latest versions of all instrument hosts
 */
export const selectLatestVersionInstrumentHosts = (state:RootState): InstrumentHostItems => {
  return state.instrumentHosts.items;
};

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of instrument hosts.
 * @returns {InstrumentHost[]} An filtered, and latest list of instrument hosts
 */
export const selectFilteredInstrumentHosts = createSelector([selectLatestVersionInstrumentHosts], (instrumentHosts:InstrumentHostItems) => {

  let latestInstrumentHosts:InstrumentHost[] = [];
  
  // Find the latest version of each instrument host and store it in an array
  let latestVersion:string = "";
  Object.keys(instrumentHosts).forEach( (lid) => {
    latestVersion = Object.keys(instrumentHosts[lid]).sort().reverse()[0];
    latestInstrumentHosts.push( instrumentHosts[lid][latestVersion] );
  });
  
  // Sort instrument hosts alphabetically by title
  latestInstrumentHosts.sort( (a:InstrumentHost,b:InstrumentHost) => {
    if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});

export default instrumentHostsSlice.reducer;