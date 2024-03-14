import { configureStore } from '@reduxjs/toolkit';

import investigationsReducer from "src/state/slices/investigationsSlice";
import dataManagerSlice from './slices/dataManagerSlice';

export const store = configureStore({
  reducer: {
    dataManager: dataManagerSlice,
    investigations: investigationsReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch