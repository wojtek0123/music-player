// eslint-disable-next-line import/named
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export interface Song {
  id: string;
  title: string;
  author_id: string;
  created_at: string;
  link: string;
  time: number;
  author?: Author;
}

export interface Playlist {
  id: string;
  name: string;
  user_id: string;
  songs: Song[];
  created_at: string;
}

export interface Author {
  id: string;
  name: string;
}

export interface PlaylistsState {
  defaultPlaylists: Playlist[];
  selectedPlaylist?: Playlist;
  userPlaylists: Playlist[];
  likedSongsPlaylist: Playlist | undefined;
  userPlaylistsExpectLikedSongs: Playlist[];
  status: "idle" | "loading" | "failed" | "succeeded";
  userPlaylistsStatus: "idle" | "loading" | "failed" | "succeeded";
  selectedPlaylistStatus: "idle" | "loading" | "failed" | "succeeded";
  selectedPlaylistErrorMessage: string;
}

const initialState: PlaylistsState = {
  defaultPlaylists: [],
  userPlaylists: [],
  selectedPlaylist: undefined,
  likedSongsPlaylist: undefined,
  userPlaylistsExpectLikedSongs: [],
  status: "idle",
  userPlaylistsStatus: "idle",
  selectedPlaylistStatus: "idle",
  selectedPlaylistErrorMessage: "",
};
// todo: Only owner of the liked songs playlist can see this playlist
// todo: Add property is_private to playlist in supabase database

export const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setSelectedPlaylist: (state, actions: PayloadAction<Playlist>) => {
      state.selectedPlaylist = actions.payload;
    },
    filterOutSong: (state, actions: PayloadAction<{ songId: string; playlistId: string }>) => {
      const foundPlaylist = state.userPlaylists.find((playlist) => playlist.id === actions.payload.playlistId);
      if (!foundPlaylist) return;

      const filterOutSongs = foundPlaylist.songs.filter((song) => song.id !== actions.payload.songId);
      if (!filterOutSongs) return;

      foundPlaylist.songs = filterOutSongs;

      const filterOutPlaylist = state.userPlaylists.filter((playlist) => playlist.id !== foundPlaylist.id);

      state.userPlaylists = [...filterOutPlaylist, foundPlaylist];

      state.selectedPlaylist = state.userPlaylists
        .filter((playlist) => playlist.id === state.selectedPlaylist?.id)
        .at(0);
    },
    addToLikedSongsPlaylist: (state, action: PayloadAction<Song>) => {
      if (state.likedSongsPlaylist) {
        state.likedSongsPlaylist.songs = [...state.likedSongsPlaylist.songs, action.payload];
      }
    },
    removeFromLikedSongsPlaylist: (state, action: PayloadAction<string>) => {
      if (state.likedSongsPlaylist) {
        state.likedSongsPlaylist.songs = state.likedSongsPlaylist.songs.filter((song) => song.id !== action.payload);
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(getPlaylists.fulfilled, (state, actions) => {
      state.status = "succeeded";
      if (!actions.payload) return;
      if (typeof actions.payload === "string") return;
      state.defaultPlaylists = actions.payload;
    });
    builder.addCase(getPlaylists.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(getPlaylists.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getUserPlaylists.fulfilled, (state, action) => {
      state.userPlaylistsStatus = "succeeded";

      state.likedSongsPlaylist = action.payload.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )[0];

      state.userPlaylistsExpectLikedSongs = action.payload.filter(
        (playlist) => playlist.id !== state.likedSongsPlaylist?.id,
      );

      state.userPlaylists = action.payload;
    });
    builder.addCase(getUserPlaylists.pending, (state) => {
      state.userPlaylistsStatus = "loading";
    });
    builder.addCase(getUserPlaylists.rejected, (state) => {
      state.userPlaylistsStatus = "failed";
    });
    builder.addCase(getPlaylist.fulfilled, (state, action) => {
      state.selectedPlaylistStatus = "succeeded";
      state.selectedPlaylist = action.payload;
    });
    builder.addCase(getPlaylist.pending, (state) => {
      state.selectedPlaylistStatus = "loading";
    });
    builder.addCase(getPlaylist.rejected, (state) => {
      state.selectedPlaylistStatus = "failed";
    });
  },
});

export const getPlaylist = createAsyncThunk("playlists/getPlaylist", async (playlistId: string) => {
  const { data, error } = await supabase
    .from("playlist")
    .select("id, name, user_id, created_at, songs:song( *, author ( * ) )")
    .eq("id", playlistId);

  if (error) {
    throw new Error(error.message);
  }

  return data?.at(0) as Playlist | undefined;
});

export const getPlaylists = createAsyncThunk<Playlist[] | string | undefined>("playlists/getPlaylists", async () => {
  const { data: playlists, error } = await supabase
    .from("playlist")
    .select("id, name, user_id, created_at, songs:song( *, author ( * ) )")
    .is("user_id", null);

  if (error) {
    throw new Error(error.message);
  }

  if (!playlists) {
    return [];
  }

  return playlists as Playlist[];
});

export const getUserPlaylists = createAsyncThunk("playlists/getUserPlaylists", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return [];

  const { data, error } = await supabase
    .from("playlist")
    .select("id, name, user_id, created_at, songs:song( *, author ( * ) )")
    .eq("user_id", session.user.id);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  return data as Playlist[];
});

export const { setSelectedPlaylist, filterOutSong, removeFromLikedSongsPlaylist, addToLikedSongsPlaylist } =
  playlistsSlice.actions;

export default playlistsSlice.reducer;
