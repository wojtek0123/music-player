import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Song } from "../../helpers/types";
import { supabase } from "../../helpers/supabase";

const initialSong: Song = {
  title: undefined,
  author: undefined,
  link: undefined,
};

export interface PlayerState {
  currentSong?: Song;
  isPlaying: boolean;
  queue: Array<Song>;
  history: Array<Song>;
  status: "idle" | "loading" | "failed" | "succeeded";
}

const initialState: PlayerState = {
  currentSong: initialSong,
  isPlaying: false,
  queue: [],
  history: [],
  status: "idle",
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playToggle: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
  extraReducers(builder) {
    builder.addCase(changeSong.fulfilled, (state, actions) => {
      state.status = "succeeded";
      const [song] = actions.payload;
      state.currentSong = song;
    });
    builder.addCase(changeSong.pending, (state) => {
      state.status = "loading";
      console.log("loading");
    });
    builder.addCase(changeSong.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const changeSong = createAsyncThunk("player/changeSong", async (id: string) => {
  const { data: song } = await supabase.from("song").select().eq("id", id);

  return song as Song;
});

// Action creators are generated for each case reducer function
export const { playToggle } = playerSlice.actions;

export default playerSlice.reducer;
