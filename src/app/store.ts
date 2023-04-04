import { configureStore } from "@reduxjs/toolkit";
import PlayerReducer from "../features/player/playerSlice";
import AuthReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    player: PlayerReducer,
    auth: AuthReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
