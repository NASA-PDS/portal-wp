import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { Investigation } from "src/types/investigation.d";
import { PDS4_INFO_MODEL } from "src/types/pds4-info-model";

enum INVESTIGATION_ACTIONS {
  GET_INVESTIGATION = "investigations/getInvestigation",
  GET_INVESTIGATIONS = "investigations/getInvestigations"
}

interface InvestigationsStateInterface {
  investigationItems: Investigation[]
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null | undefined
}

const initialState = {
  investigationItems: [],
  status: 'idle',
  error: null
} as InvestigationsStateInterface

const parseLID = (lid:string) => {
  
  const re = /urn:(.+):(.+):context:(.+):(.*)\.(.*)$/i;
  const matches = lid.match(re);
  
  if( matches != undefined && matches?.length > 0 ) {
    
    const agency = matches[1];
    const archive = matches[2];
    const category = matches[3];
    const investigationTypeParts = matches[4].split("."); 
    const investigationType = investigationTypeParts[0];
    const investigationSubType = investigationTypeParts.length > 0 ? investigationTypeParts[1] : undefined;
    const identifier = matches[5];
    
    return { agency, archive, category, investigationType, investigationSubType, identifier }
    
  } else {
    console.log("Unable to parse LID:", lid)
  }
  
  return null
  
};

// Get all the investigations from the PDS OpenSearch API
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
      "size": 500,
      "query": {
        "wildcard": {
          [PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]: {
            "value": "*"
          }
        }
      },
      "_source": {
        "includes": [
          "lid",
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
  
  // Get an investigation from the PDS OpenSearch API
  export const getInvestigation = createAsyncThunk(
    INVESTIGATION_ACTIONS.GET_INVESTIGATION,
    async (investigationLID:String, thunkAPI) => {
      
      const username = import.meta.env.VITE_OPENSEARCH_USERNAME;
      const password = import.meta.env.VITE_OPENSEARCH_PASSWORD;
      const url = import.meta.env.VITE_OPENSEARCH_DOMAIN + "registry,atm-prod-ccs:registry/_search";
      
      const headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(username + ":" + password)
      }
      
      // Set up query
      const query = {
        "from": 0,
        "size": 1,
        "query": {
          "match": {
            [PDS4_INFO_MODEL.LID]: investigationLID
          }
        },
        "_source": {
          "includes": [
            PDS4_INFO_MODEL.LID,
            PDS4_INFO_MODEL.ALIAS.ALTERNATE_ID,
            PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE,
            PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID,
            PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION,
            PDS4_INFO_MODEL.INVESTIGATION.NAME,
            PDS4_INFO_MODEL.INVESTIGATION.START_DATE,
            PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE,
            PDS4_INFO_MODEL.INVESTIGATION.TYPE,
          ]
        }
      };
      
      try{
        const response = await axios.post(url, query, {headers: headers})
        return response.data;
      } catch (err:any) {
        return thunkAPI.rejectWithValue({ error: err.message });
      }
    }
    );
    
    const getInvestigationIndex = (arr_to_check:Investigation[], lid:string, version:string):number | undefined => { 
      

      const arrayIndex:number = arr_to_check.findIndex( (item) => 
        item.lid == lid
      );

      if( arrayIndex !== -1 ) {

        if( arr_to_check[arrayIndex][PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID] < version ) {
          return arrayIndex;
        } else {
          return undefined
        }
      }
      
      return -1;
      
    };
    
    const investigationsSlice = createSlice({
      name: "investigations",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
        
        builder.addCase(getInvestigations.pending, (state, action) => {
          // When data is being fetched
          state.status = "pending";
        });
        
        builder.addCase(getInvestigations.fulfilled, (state, action) => {
          // When data is fetched successfully
          state.status = "succeeded";
          
          // Store the fetched data into the state after parsing
          const investigation_data = action.payload.hits.hits
          
          let compiledInvestigations:Investigation[] = [];
          for( var i = 0; i < investigation_data.length; i++ ) {
            
            const lid = investigation_data[i]._source[PDS4_INFO_MODEL.LID];
            const investigationMetadata = parseLID(lid);
            
            if( investigationMetadata != null ) {
              
              const version = investigation_data[i]._source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID][0];
              
              const investigationIndex:number | undefined = getInvestigationIndex(compiledInvestigations, lid, version);
              let investigation:Investigation = {
                [PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE]: PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE in investigation_data[i]._source ? investigation_data[i]._source[PDS4_INFO_MODEL.ALIAS.ALTERNATE_TITLE][0] : "",
                [PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION]: investigation_data[i]._source[PDS4_INFO_MODEL.INVESTIGATION.DESCRIPTION][0],
                [PDS4_INFO_MODEL.LID]: lid,
                [PDS4_INFO_MODEL.INVESTIGATION.START_DATE]: investigation_data[i]._source[PDS4_INFO_MODEL.INVESTIGATION.START_DATE][0],
                [PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE]: investigation_data[i]._source[PDS4_INFO_MODEL.INVESTIGATION.STOP_DATE][0],
                [PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE]: investigation_data[i]._source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.TITLE][0],
                [PDS4_INFO_MODEL.INVESTIGATION.TYPE]: investigation_data[i]._source[PDS4_INFO_MODEL.INVESTIGATION.TYPE][0],
                [PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID]: investigation_data[i]._source[PDS4_INFO_MODEL.IDENTIFICATION_AREA.VERSION_ID][0],
              }

              if( investigationIndex === -1 ) {
                compiledInvestigations.push(investigation);
              } else if( investigationIndex !== undefined ) {
                compiledInvestigations[investigationIndex] = investigation;
              }

            }
            
          }
          state.investigationItems = compiledInvestigations.sort( (a,b) => {
            if( a["pds:Identification_Area/pds:title"].toLowerCase() < b["pds:Identification_Area/pds:title"].toLowerCase() ) {
              return -1
            }
            if( a["pds:Identification_Area/pds:title"].toLowerCase() > b["pds:Identification_Area/pds:title"].toLowerCase() ) {
              return 1
            }
            return 0
          });
          
        });
        
        builder.addCase(getInvestigations.rejected, (state, action) => {
          // When data is fetched unsuccessfully
          state.status = "failed";
          
          // Update the error message for proper error handling
          state.error = action.error.message;
        });
        
        builder.addCase(getInvestigation.fulfilled, (state, action) => {
          // When data is fetched successfully
          state.status = "succeeded";
          
          // Store the fetched data into the state after parsing
          let investigation_data = action.payload.hits.hits;
          console.log(investigation_data)
          
        });
      }
    });
    
    export default investigationsSlice.reducer;