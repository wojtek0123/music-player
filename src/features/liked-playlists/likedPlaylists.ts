import { Playlist, Status } from "../playlists/playlistsSlice";
// eslint-disable-next-line import/named
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

interface LikedPlaylistsState {
  likedPlaylists: Playlist[];
  status: Status;
  errorMessage: string;
}

const initialState: LikedPlaylistsState = {
  likedPlaylists: [],
  status: "idle",
  errorMessage: "",
};

const likedPlaylistsSlice = createSlice({
  name: "liked-playlists",
  initialState,
  reducers: {
    addPlaylistToLiked: (state, action: PayloadAction<Playlist>) => {
      state.likedPlaylists = [...state.likedPlaylists, action.payload];
    },
    removePlaylistFromLiked: (state, action: PayloadAction<string>) => {
      state.likedPlaylists = state.likedPlaylists.filter((playlist) => playlist.id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserLikedPlaylists.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getUserLikedPlaylists.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(getUserLikedPlaylists.fulfilled, (state, action) => {
      state.likedPlaylists = action.payload;
      state.status = "succeeded";
    });
  },
});

export const getUserLikedPlaylists = createAsyncThunk("liked-playlists/getUserLikedPlaylists", async () => {
  const { data: response } = await supabase.auth.getSession();

  // if (!response.session) throw new Error();

  const { data, error } = await supabase
    .from("liked-playlists")
    .select("id, playlist(id, name, user_id, songs:song(*, author(*)))")
    .eq("user_id", response.session?.user.id);

  if (error) {
    throw new Error(error.message);
  }

  const playlists = data.flatMap((response) => response.playlist);

  return playlists as Playlist[];
});

export const { addPlaylistToLiked, removePlaylistFromLiked } = likedPlaylistsSlice.actions;

export default likedPlaylistsSlice.reducer;
