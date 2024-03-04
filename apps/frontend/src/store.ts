import { configureStore } from '@reduxjs/toolkit';

import investigationsReducer from "src/features/investigations/investigationsSlice";

export const store = configureStore({
  reducer: {
    investigations: investigationsReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch