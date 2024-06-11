import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { Investigation, INVESTIGATION_TYPE } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum INVESTIGATION_ACTIONS {
  GET_INVESTIGATIONS = "investigations/getInvestigations",
  SET_INVESTIGATIONS_SEARCH_FILTERS = "investigations/setSearchFilters",
}

export type InvestigationItems = {
  [index:string]: { 
    [index:string]: Investigation 
  }
};

export type InvestigationDirectorySearchFilterState = {
  freeText:string,
  type:INVESTIGATION_TYPE,
}

export type InvestigationsState = {
  error: string | null | undefined
  items: InvestigationItems
  searchFilters: InvestigationDirectorySearchFilterState | undefined
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
};

const initialState:InvestigationsState = {
  error: null,
  items: <InvestigationItems>{},
  searchFilters: undefined,
  status: 'idle',
};

/**
 * Get all the investigations from the PDS Search API
 */
export const getInvestigations = createAsyncThunk(
  INVESTIGATION_ACTIONS.GET_INVESTIGATIONS,
  async (_:void, thunkAPI) => {

    let apiUrl = '/api/search/1/products?q=(product_class eq "Product_Context" and lid like "urn:nasa:pds:context:investigation:*")&limit=9999'
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    };
    
    const fields = [
      PDS4_INFO_MODEL.LID,
      PDS4_INFO_MODEL.LIDVID,
      PDS4_INFO_MODEL.REF_LID_TARGET,
      PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST,
      PDS4_INFO_MODEL.REF_LID_INSTRUMENT,
      PDS4_INFO_MODEL.VID,
      PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID,
      PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE,
      PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION,
      PDS4_INFO_MODEL.INVESTIGATION.NAME,
      PDS4_INFO_MODEL.INVESTIGATION.START_DATE,
      PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE,
      PDS4_INFO_MODEL.INVESTIGATION.TYPE,
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

const investigationsSlice = createSlice({
  name: "investigations",
  initialState,
  reducers: {
    setFreeTextSearchFilter: (state, action:PayloadAction<string>) => {
      if( state.searchFilters === undefined ) {
        state.searchFilters = <InvestigationDirectorySearchFilterState>{}
      }
      state.searchFilters.freeText = action.payload;
    },
    setInvestigationTypeSearchFilter: (state, action:PayloadAction<INVESTIGATION_TYPE>) => {
      if( state.searchFilters === undefined ) {
        state.searchFilters = <InvestigationDirectorySearchFilterState>{}
      }
      state.searchFilters.type = action.payload;
    }
  },
  extraReducers: (builder) => {
    
    builder.addCase(getInvestigations.pending, (state, _action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getInvestigations.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      
      // Store the fetched data into the state after parsing
      const data = action.payload.data;

      const compiledInvestigations:InvestigationItems = {};
      data.forEach( (element:{"summary":object, "properties":object}) => {

        const source:Investigation = <Investigation>element["properties"];

        const lid = source[PDS4_INFO_MODEL.LID][0];
        const vid = source[PDS4_INFO_MODEL.VID][0];

        const investigationItem:Investigation = <Investigation>{};

        // Update General Information
        investigationItem[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID][0];
        investigationItem[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID][0];
        investigationItem[PDS4_INFO_MODEL.REF_LID_INSTRUMENT] = source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT];
        investigationItem[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST] = source[PDS4_INFO_MODEL.REF_LID_INSTRUMENT_HOST];
        investigationItem[PDS4_INFO_MODEL.REF_LID_TARGET] = source[PDS4_INFO_MODEL.REF_LID_TARGET];
        investigationItem[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID][0];

        // Update Alias Information
        investigationItem[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID] = source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID] ? source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID] : [];
        investigationItem[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE] = source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE] ? source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE] : [];

        // Update Investigation Information
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] = source[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] ? source[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION][0] : "";
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.NAME] = source[PDS4_INFO_MODEL.INVESTIGATION.NAME] ? source[PDS4_INFO_MODEL.INVESTIGATION.NAME][0] : "";
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.START_DATE] = source[PDS4_INFO_MODEL.INVESTIGATION.START_DATE] ? source[PDS4_INFO_MODEL.INVESTIGATION.START_DATE][0] : "";
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] = source[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] ? source[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE][0] : "";
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION] = source[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION] ? source[PDS4_INFO_MODEL.INVESTIGATION.TERSE_DESCRIPTION][0] : "";
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.TYPE] = source[PDS4_INFO_MODEL.INVESTIGATION.TYPE] ? source[PDS4_INFO_MODEL.INVESTIGATION.TYPE][0] : "";
        
        if( compiledInvestigations[lid] === undefined ) {
          compiledInvestigations[lid] = {};
        }

        compiledInvestigations[lid][vid] = <Investigation>investigationItem;

      });

      state.items = compiledInvestigations;

    });
    
    builder.addCase(getInvestigations.rejected, (state, action) => {
      // When data is fetched unsuccessfully
      state.status = "failed";
      
      // Update the error message for proper error handling
      state.error = action.error.message;
    });

  }
});

export const { setFreeTextSearchFilter, setInvestigationTypeSearchFilter } = investigationsSlice.actions;
export default investigationsSlice.reducer;