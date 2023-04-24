// eslint-disable-next-line import/named
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export interface Song {
  id: string;
  title: string;
  author_id: string;
  created_at: string;
  link: string;
  album?: string;
  author?: Author;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface Author {
  id: string;
  name: string;
}

export interface PlaylistsState {
  playlists: Playlist[];
  selectedPlaylist?: Playlist;
  status: "idle" | "loading" | "failed" | "succeeded";
}

const initialState: PlaylistsState = {
  playlists: [],
  selectedPlaylist: undefined,
  status: "idle",
};

export const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setSelectedPlaylist: (state, actions: PayloadAction<string>) => {
      const filteredPlaylist = state.playlists.filter((playlist) => playlist.id === actions.payload).at(0);

      state.selectedPlaylist = filteredPlaylist;
    },
  },
  extraReducers(builder) {
    builder.addCase(getPlaylists.fulfilled, (state, actions) => {
      state.status = "succeeded";
      if (!actions.payload) return;
      if (typeof actions.payload === "string") return;
      state.playlists = actions.payload;
    });
    builder.addCase(getPlaylists.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(getPlaylists.pending, (state) => {
      state.status = "loading";
    });
  },
});

export const getPlaylists = createAsyncThunk<Playlist[] | string | undefined>("playlists/getPlaylists", async () => {
  try {
    const {
      data: playlists,
      status,
      error,
    } = await supabase.from("playlist").select("id, name, songs:song( *, author ( * ) )");

    if (status !== 200) throw new Error(error?.message);

    return playlists as Playlist[];
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
});

export const { setSelectedPlaylist } = playlistsSlice.actions;

export default playlistsSlice.reducer;
