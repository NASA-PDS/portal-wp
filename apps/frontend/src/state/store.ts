import { configureStore } from '@reduxjs/toolkit';

import investigationsReducer from "src/state/slices/investigationsSlice";
import targetsReducer from "src/state/slices/targetsSlice";
import dataManagerSlice from './slices/dataManagerSlice';

export const store = configureStore({
  reducer: {
    dataManager: dataManagerSlice,
    investigations: investigationsReducer,
    targets: targetsReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch