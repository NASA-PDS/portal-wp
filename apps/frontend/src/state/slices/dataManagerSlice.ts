import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getInvestigations } from './investigationsSlice';
import { getTargets } from './targetsSlice';
import { getInstrumentHosts } from './instrumentHostsSlice';
import { getInstruments } from './instrumentsSlice';
import { instrumentDataReady, instrumentHostDataReady, investigationDataReady, targetDataReady } from '../selectors';

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

    await Promise.all([
        api.dispatch(getInstrumentHosts()),
        api.dispatch(getInstruments()),
        api.dispatch(getInvestigations()),
        api.dispatch(getTargets())
    ]).catch( (error) => {
      return api.rejectWithValue(error);
    });

  }
)

export const dataRequiresFetchOrUpdate = (state:DataManagerState):boolean => {
  return state.status === 'failed' || state.lastUpdated === undefined || state.lastUpdated <= (Date.now() - 14400000)
};

export const dataReady = createSelector(
  [
    investigationDataReady,
    targetDataReady,
    instrumentHostDataReady,
    instrumentDataReady
  ],
  (
    investigationDataReady,
    targetDataReady,
    instrumentHostDataReady,
    instrumentDataReady
  ):boolean => {
    return investigationDataReady && targetDataReady && instrumentHostDataReady && instrumentDataReady
  }
);

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