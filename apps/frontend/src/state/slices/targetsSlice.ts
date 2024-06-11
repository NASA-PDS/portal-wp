import axios from 'axios';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
 * Get all the targets from the PDS Search API
 */ 
export const getTargets = createAsyncThunk(
  TARGET_ACTIONS.GET_TARGETS,
  async (_:void, thunkAPI) => {
    
    let apiUrl = '/api/search/1/products?q=(product_class eq "Product_Context" and lid like "urn:nasa:pds:context:target:*")&limit=9999'
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };
    
    const fields = [
      PDS4_INFO_MODEL.LID,
      PDS4_INFO_MODEL.LIDVID,
      PDS4_INFO_MODEL.TITLE,
      PDS4_INFO_MODEL.VID,
      PDS4_INFO_MODEL.TARGET.DESCRIPTION,
      PDS4_INFO_MODEL.TARGET.NAME,
      PDS4_INFO_MODEL.TARGET.TYPE
    ];

    // Add the specific fields that should be returned
    apiUrl += "&fields=";
    fields.forEach( (field, index) => {
      apiUrl += field;
      apiUrl += index < fields.length - 1 ? "," : "";
    });
    
    try {
      
      //const response = await fetch(apiUrl, config);
      const response = await axios.get(apiUrl, config);
      return response.data;
    } catch (err:unknown) {
      if( err instanceof Error ) {
        return thunkAPI.rejectWithValue({ error: err.message });
      }
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
      const data = action.payload.data;

      const compiledItems:TargetItems = {};
      data.forEach( (element:{"summary":object, "properties":object}) => {

        const source:Target = <Target>element["properties"];

        const lid = source[PDS4_INFO_MODEL.LID][0];
        const vid = source[PDS4_INFO_MODEL.VID][0];

        const target:Target = <Target>{};
        target[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID][0];
        target[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID][0];
        target[PDS4_INFO_MODEL.TITLE] = source[PDS4_INFO_MODEL.TITLE][0];
        target[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID][0];
        target[PDS4_INFO_MODEL.TARGET.DESCRIPTION] = source[PDS4_INFO_MODEL.TARGET.DESCRIPTION] ? source[PDS4_INFO_MODEL.TARGET.DESCRIPTION] : "";
        target[PDS4_INFO_MODEL.TARGET.NAME] = source[PDS4_INFO_MODEL.TARGET.NAME] ? source[PDS4_INFO_MODEL.TARGET.NAME][0] : "";
        target[PDS4_INFO_MODEL.TARGET.TYPE] = source[PDS4_INFO_MODEL.TARGET.TYPE] ? source[PDS4_INFO_MODEL.TARGET.TYPE][0] : "";

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

export default targetsSlice.reducer;