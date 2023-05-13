import { configureStore } from "@reduxjs/toolkit";
import PlayerReducer from "../features/player/playerSlice";
import AuthReducer from "../features/auth/authSlice";
import PlaylistsReducer from "../features/playlists/playlistsSlice";
import PopupReducer from "../features/popup/popupSlice";

export const store = configureStore({
  reducer: {
    player: PlayerReducer,
    auth: AuthReducer,
    playlists: PlaylistsReducer,
    popupMenu: PopupReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
