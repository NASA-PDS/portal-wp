import axios from 'axios';
import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";

import { Investigation, INVESTIGATION_TYPE } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum INVESTIGATION_ACTIONS {
  GET_INVESTIGATION = "investigations/getInvestigation",
  GET_INVESTIGATIONS = "investigations/getInvestigations",
  SET_INVESTIGATIONS_FILTER = "investigations/setFilter",
}

type InvestigationItems = { 
  [index:string]: { 
    [index:string]: Investigation 
  } 
};

export type InvestigationDirectorySearchFilterState = {
  freeText:string,
  type:INVESTIGATION_TYPE,
}

type InvestigationsState = {
  error: string | null | undefined
  items: InvestigationItems
  searchFilters: InvestigationDirectorySearchFilterState | undefined
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
};

const initialState:InvestigationsState = {
  error: null,
  items: {},
  searchFilters: undefined,
  status: 'idle',
};

/**
 * Get all the investigations from the PDS OpenSearch API
 */ 
export const getInvestigations = createAsyncThunk(
  INVESTIGATION_ACTIONS.GET_INVESTIGATIONS,
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
          [PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]: {
            "value": "*"
          }
        }
      },
      "_source": {
        "includes": [
          PDS4_INFO_MODEL.LID,
          PDS4_INFO_MODEL.LIDVID,
          PDS4_INFO_MODEL.VID,
          PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID,
          PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE,
          PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE,
          PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID,
          PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION,
          PDS4_INFO_MODEL.INVESTIGATION.NAME,
          PDS4_INFO_MODEL.INVESTIGATION.START_DATE,
          PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE,
          PDS4_INFO_MODEL.INVESTIGATION.TYPE,
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

export const getEverything = createAsyncThunk(
  'pds/data/get_everything',
  async(_:void, thunkAPI) => {

    const username = import.meta.env.VITE_OPENSEARCH_USERNAME;
    const password = import.meta.env.VITE_OPENSEARCH_PASSWORD;
    const url = import.meta.env.VITE_OPENSEARCH_DOMAIN + "_msearch";
    
    const headers = {
      "Content-Type": "application/x-ndjson",
      "Authorization": "Basic " + btoa(username + ":" + password)
    }

    // Set up query
    const query = `
      { "index": [ "registry", "atm-prod-ccs:registry", "img-prod-ccs:registry" ] }
      { "query": { "wildcard": { "lid": { "value": "urn:*:investigation:*" } } }, "_source": { "includes": [ "${PDS4_INFO_MODEL.LID}", "lidvid", "pds:Identification_Area/pds:name", "pds:Identification_Area/pds:title", "pds:Investigation/pds:name", "pds:Investigation/pds:description", "pds:Investigation/pds:start_date", "pds:Investigation/pds:stop_date", "pds:Investigation/pds:type", "pds:Alias/pds:alternate_id", "pds:Alias/pds:alternate_title" ] }, "from": 0, "size": 9999 }
      { "index": [ "registry", "atm-prod-ccs:registry", "img-prod-ccs:registry" ] }
      { "query": { "wildcard": { "lid": { "value": "urn:*:target:*" } } }, "_source": { "includes": [ "${PDS4_INFO_MODEL.LID}" ] }, "from": 0, "size": 9999 }
      { "index": [ "registry", "atm-prod-ccs:registry", "img-prod-ccs:registry" ] }
      { "query": { "wildcard": { "lid": { "value": "urn:*:instrument_host:*" } } }, "_source": { "includes": [ "${PDS4_INFO_MODEL.LID}" ] }, "from": 0, "size": 9999 }
      { "index": [ "registry", "atm-prod-ccs:registry", "img-prod-ccs:registry" ] }
      { "query": { "wildcard": { "lid": { "value": "urn:*:instrument:*" } } }, "_source": { "includes": [ "${PDS4_INFO_MODEL.LID}" ] }, "from": 0, "size": 9999 }
    ` + "\n";
    
    try {
      const response = await axios.post(url, query, {headers: headers})   // missing newline error
      return response.data
    } catch (err:any) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }

  }
)

const updateInvestigationsState = (state:InvestigationsState, data) => {

  let compiledInvestigations:InvestigationItems = {};
  data.forEach( (element:{_source:object}) => {

    const source:Investigation = <Investigation>element["_source"];

    const lid = source[PDS4_INFO_MODEL.LID];
    const vid = source[PDS4_INFO_MODEL.VID];

    let investigationItem:Investigation = <Investigation>{};
    investigationItem[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID];
    investigationItem[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID];
    investigationItem[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID];
    investigationItem[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID] = source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID];
    investigationItem[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE] = source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE];
    investigationItem[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE] = source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE][0];
    investigationItem[PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID] = source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID][0];
    investigationItem[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] = source[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION][0];
    investigationItem[PDS4_INFO_MODEL.INVESTIGATION.NAME] = source[PDS4_INFO_MODEL.INVESTIGATION.NAME] ? source[PDS4_INFO_MODEL.INVESTIGATION.NAME][0] : "";
    investigationItem[PDS4_INFO_MODEL.INVESTIGATION.START_DATE] = source[PDS4_INFO_MODEL.INVESTIGATION.START_DATE][0];
    investigationItem[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] = source[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE][0];
    investigationItem[PDS4_INFO_MODEL.INVESTIGATION.TYPE] = source[PDS4_INFO_MODEL.INVESTIGATION.TYPE][0];

    if( compiledInvestigations[lid] === undefined ) {
      compiledInvestigations[lid] = {};
    }

    compiledInvestigations[lid][vid] = <Investigation>investigationItem;

  });
  
  state.items = compiledInvestigations;

}


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
    
    builder.addCase(getInvestigations.pending, (state, action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getInvestigations.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      
      // Store the fetched data into the state after parsing
      const data = action.payload.hits.hits;

      let compiledInvestigations:InvestigationItems = {};
      data.forEach( (element:{_source:object}) => {

        const source:Investigation = <Investigation>element["_source"];

        const lid = source[PDS4_INFO_MODEL.LID];
        const vid = source[PDS4_INFO_MODEL.VID];

        let investigationItem:Investigation = <Investigation>{};
        investigationItem[PDS4_INFO_MODEL.LID] = source[PDS4_INFO_MODEL.LID];
        investigationItem[PDS4_INFO_MODEL.LIDVID] = source[PDS4_INFO_MODEL.LIDVID];
        investigationItem[PDS4_INFO_MODEL.VID] = source[PDS4_INFO_MODEL.VID];
        investigationItem[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID] = source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID];
        investigationItem[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE] = source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE];
        investigationItem[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE] = source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE][0];
        investigationItem[PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID] = source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID][0];
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION] = source[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION][0];
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.NAME] = source[PDS4_INFO_MODEL.INVESTIGATION.NAME] ? source[PDS4_INFO_MODEL.INVESTIGATION.NAME][0] : "";
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.START_DATE] = source[PDS4_INFO_MODEL.INVESTIGATION.START_DATE][0];
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE] = source[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE][0];
        investigationItem[PDS4_INFO_MODEL.INVESTIGATION.TYPE] = source[PDS4_INFO_MODEL.INVESTIGATION.TYPE][0];

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

    builder.addCase(getEverything.pending, (state, action) => {
      // When data is being fetched
      state.status = "pending";
    });
    
    builder.addCase(getEverything.fulfilled, (state, action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      console.log("SUCCESS!")
      
      updateInvestigationsState(state, action.payload.responses[0].hits.hits);

      // Store the fetched data into the state after parsing
      /*console.log("Investigations: ", action.payload.responses[0]);
      console.log("Targets: ", action.payload.responses[1]);
      console.log("Instrument Hosts: ", action.payload.responses[2]);
      console.log("Instruments: ", action.payload.responses[3]);*/

      const data = action.payload.hits.hits;

    });
    
    builder.addCase(getEverything.rejected, (state, action) => {
      // When data is fetched unsuccessfully
      state.status = "failed";
      
      // Update the error message for proper error handling
      state.error = action.error.message;
    });
    
  }
});

/**
 * A redux selector to efficiently retrive a list of the latest investigation.
 * @param {InvestigationsState} state The invesigations redux state of type InvestigationsState
 * @returns {Investigation[]} An array containing the list of the latest versions of all investigations
 */
const selectLatestVersionInvestigations = (state:InvestigationsState): InvestigationItems => {
  return state.items;
};

/**
 * The search filter that should be applied to the list of investigations.
 * @param {InvestigationsState} state The invesigations redux state of type InvestigationsState
 * @returns {string} The search filter currently being applied
 */
const selectSearchFilters = (state:InvestigationsState) => {
  return state.searchFilters;
};

/**
 * A memoized redux selector that efficiently returns the latest, and filtered list of investigations.
 * @returns {Investigation[]} An filtered, and latest list of investigations
 */
export const selectFilteredInvestigations = createSelector([selectLatestVersionInvestigations, selectSearchFilters], (investigations:InvestigationItems, searchFilters) => {

  let latestInvestigations:Investigation[] = [];
  
  // Find the latest version of each investigation and store it in an array
  let latestVersion:string = "";
  Object.keys(investigations).forEach( (lid) => {
    latestVersion = Object.keys(investigations[lid]).sort().reverse()[0];
    latestInvestigations.push( investigations[lid][latestVersion] );
  });
  
  // Sort investigations alphabetically by title
  latestInvestigations.sort( (a:Investigation,b:Investigation) => {
    if( a[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() < b[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() ) {
      return -1
    } else if( a[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() > b[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase() ) {
      return 1
    }
    return 0;
  });

  if( searchFilters === undefined ) {
    return latestInvestigations;
  }

  return latestInvestigations.filter(
    (item) => {
      return (
        item[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE].toLowerCase().includes(searchFilters?.freeText || "")
        &&
        ( searchFilters.type === undefined || searchFilters.type === INVESTIGATION_TYPE.ALL || item[PDS4_INFO_MODEL.INVESTIGATION.TYPE] === searchFilters.type )
      )
    }
  );

});

export const { setFreeTextSearchFilter, setInvestigationTypeSearchFilter } = investigationsSlice.actions;
export default investigationsSlice.reducer;