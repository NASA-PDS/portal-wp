import axios from 'axios';
import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

import { Target } from "src/types/target.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum TARGET_ACTIONS {
  GET_TARGETS = "targets/getTargets",
}

export type TargetItems = {
  [index:string]: { 
    [index:string]: Target
  } 
};

export type TargetsState = {
  error: string | null | undefined
  items: TargetItems
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
};

const initialState:TargetsState = {
  error: null,
  items: <TargetItems>{},
  status: 'idle',
};

/**
 * Get all the targets from the PDS OpenSearch API
 */ 
export const getTargets = createAsyncThunk(
  TARGET_ACTIONS.GET_TARGETS,
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
            "value": "urn:*:target:*"
          }
        }
      },
      "_source": {
        "includes": [
          PDS4_INFO_MODEL.LID,
          PDS4_INFO_MODEL.LIDVID,
          PDS4_INFO_MODEL.TITLE,
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

const targetsSlice = createSlice({
  name: "targets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getTargets.pending, (state, _action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getTargets.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      
      // Store the fetched data into the state after parsing
      const data = action.payload.hits.hits;

      let compiledItems:TargetItems = {};
      data.forEach( (element:{_source:object}) => {

        const source:Target = <Target>element["_source"];

        const lid = source[PDS4_INFO_MODEL.LID];
        const vid = source[PDS4_INFO_MODEL.VID];

        let target:Target = <Target>{};
        target[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID];
        target[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID];
        target[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE];
        target[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID];

        if( compiledItems[lid] === undefined ) {
          compiledItems[lid] = {};
        }

        compiledItems[lid][vid] = target;

      });
      
      state.items = compiledItems;

    });
    
    builder.addCase(getTargets.rejected, (state, action) => {
      // When data is fetched unsuccessfully
      state.status = "failed";
      
      // Update the error message for proper error handling
      state.error = action.error.message;
    });
    
  }
});

/**
 * A redux selector to efficiently retrieve a list of the latest targets.
 * @param {TargetsState} state The targets redux state of type TargetsState
 * @returns {Target[]} An array containing the list of the latest versions of all targets
 */
export const selectLatestVersionTargets = (state:TargetsState): TargetItems => {
  return state.items;
};

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of targets.
 * @returns {Target[]} An filtered, and latest list of targets
 */
export const selectFilteredTargets = createSelector([selectLatestVersionTargets], (targets:TargetItems) => {

  let latestTargets:Target[] = [];
  
  // Find the latest version of each target and store it in an array
  let latestVersion:string = "";
  Object.keys(targets).forEach( (lid) => {
    latestVersion = Object.keys(targets[lid]).sort().reverse()[0];
    latestTargets.push( targets[lid][latestVersion] );
  });
  
  // Sort targets alphabetically by title
  latestTargets.sort( (a:Target,b:Target) => {
    if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

});

export default targetsSlice.reducer;