import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { Investigation } from "../../types/investigation.d";

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

const parseID = (lid:string) => {

   //const re = /urn:(.*):(.*):context:(.*):([^\.]*).([^\.]*)::(.*)/i;
   const re = /urn:(.+):(.+):context:(.+):(.*)\.(.*)::(.*)/i;
   const matches = lid.match(re);
   
   if( matches != undefined && matches?.length > 0 ) {

      const agency = matches[1];
      const archive = matches[2];
      const category = matches[3];
      const investigationTypeParts = matches[4].split("."); 
      const investigationType = investigationTypeParts[0];
      const investigationSubType = investigationTypeParts.length > 0 ? investigationTypeParts[1] : undefined;
      const identifier = matches[5];
      const version = matches[6];

      return { agency, archive, category, investigationType, investigationSubType, identifier, version }

   } else {
      console.log("Unable to parse LID:", lid)
   }
   
   return null

};

const investigations_versions = {
   "apollo_12": [
      {
         "version": "1.0",
      }
   ],
   "apollo_14": [
      {
         "version": "1.0",
      }
   ],
}

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
            "pds:Investigation/pds:description": {
              "value": "*"
            }
          }
        },
        "_source": {
          "includes": [
            "lid",
            "pds:Investigation/pds:name",
            "pds:Investigation/pds:description",
            "pds:Investigation/pds:start_date",
            "pds:Investigation/pds:stop_date",
            "pds:Investigation/pds:type",
            "pds:Alias/pds:alternate_id",
            "pds:Alias/pds:alternate_title"
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
   async (investigationID:String, thunkAPI) => {
      
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
          "wildcard": {
            "pds:Investigation/pds:description": {
              "value": "*"
            }
          }
        },
        "_source": {
          "includes": [
            "lid",
            "pds:Investigation/pds:name",
            "pds:Investigation/pds:description",
            "pds:Investigation/pds:start_date",
            "pds:Investigation/pds:stop_date",
            "pds:Investigation/pds:type",
            "pds:Alias/pds:alternate_id",
            "pds:Alias/pds:alternate_title"
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
         let investigation_data = action.payload.hits.hits
         console.log("Returned Data: ", investigation_data);
         let arr = [];
         for( var i = 0; i < investigation_data.length; i++ ) {
            const id = investigation_data[i]["_id"];
            const lid = investigation_data[i]._source["lid"]
            const investigationMetadata = parseID(id);
            console.log("lid", lid)
            //console.log("Investigation Metadata", investigationMetadata);
            if( investigationMetadata != null ) {
               let investigation:Investigation = {
                  "id": investigationMetadata['identifier'],
                  "lid": investigation_data[i]._source["lid"],
                  "shortName": investigationMetadata['identifier'],
                  "longName": "pds:Investigation/pds:name" in investigation_data[i]._source ? investigation_data[i]._source["pds:Investigation/pds:name"][0] : "",
                  "description": investigation_data[i]._source["pds:Investigation/pds:description"][0],
                  "startDate": investigation_data[i]._source["pds:Investigation/pds:start_date"][0],
                  "stopDate": investigation_data[i]._source["pds:Investigation/pds:stop_date"][0],
                  "type": investigation_data[i]._source["pds:Investigation/pds:type"][0],
               }
               arr.push(investigation)
            }

         }

         state.investigationItems = arr;

      });

      builder.addCase(getInvestigations.rejected, (state, action) => {
         // When data is fetched unsuccessfully
         state.status = "failed";

         // Update the error message for proper error handling
         state.error = action.error.message;
      });
   }
});

export default investigationsSlice.reducer;