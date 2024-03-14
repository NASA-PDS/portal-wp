import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getInvestigations } from './investigationsSlice';
import { getTargets } from './targetsSlice';
import { getInstrumentHosts } from './instrumentHostsSlice';

type DataManagerState = {
  lastUpdated:number | undefined
  error: string | null | undefined
  status: 'idle' | 'pending' | 'succeeded' | 'failed'
}
const initialState:DataManagerState = {
  lastUpdated: undefined,
  error: null,
  status: 'idle'
};

export const getData = createAsyncThunk(
  'data-manager/',
  async (_, api) => {

    const response = await Promise.all([
      api.dispatch(getInstrumentHosts()),
      api.dispatch(getInvestigations()),
      api.dispatch(getTargets())
    ]);

    if( response.find( (item:any) => item.error) ) {
      const errors = response.map( (item) => item.payload );
      return api.rejectWithValue(errors);
    } else {
      return {
        instrumentHosts: response[0].payload.hits,
        investigations: response[1].payload.hits,
        targets: response[0].payload.hits,
      }
    }

  }
)

export const dataRequiresFetchOrUpdate = (state:DataManagerState):boolean => {
  return state.status === 'failed' || state.lastUpdated === undefined || state.lastUpdated <= (Date.now() - 14400000)
};

export const dataManagerSlice = createSlice({
  name: "dataManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(getData.pending, (state, _action) => {
      // When data is being fetched
      state.status = "pending";
    })

    builder.addCase(getData.fulfilled, (state, _action) => {
      // When data is fetched successfully
      state.status = "succeeded";
      state.lastUpdated = Date.now();
    })

    builder.addCase(getData.rejected, (state, action) => {
      // When data is fetched unsuccessfully
      state.status = "failed";
      
      // Update the error message for proper error handling
      state.error = action.error.message;
    })

  }
});

export default dataManagerSlice.reducer;