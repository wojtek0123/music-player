import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Song } from "../../helpers/types";
import { supabase } from "../../lib/supabase";

const initialSong: Song | undefined = undefined;

export interface PlayerState {
  currentSong?: Song;
  isPlaying: boolean;
  queue: string[];
  history: string[];
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
    pushHistory: (state, actions) => {
      state.history.push(actions.payload);
    },
    popHistory: (state) => {
      state.history.pop();
    },
    pushQueue: (state, actions) => {
      state.queue.push(actions.payload);
    },
    shiftQueue: (state) => {
      state.queue.shift();
    },
    putRandomSongFirstInQueue: (state) => {
      if (state.queue.length <= 1) return;

      const randomIndex = Math.floor(Math.random() * (state.queue.length - 1)) + 1; // all indexes except 0

      const temp = state.queue[0];

      state.queue[0] = state.queue[randomIndex];
      state.queue[randomIndex] = temp;
    },
  },
  extraReducers(builder) {
    builder.addCase(changeSong.fulfilled, (state, actions) => {
      state.status = "succeeded";
      const song = actions.payload;
      state.currentSong = song;
    });
    builder.addCase(changeSong.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(changeSong.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const changeSong = createAsyncThunk("player/changeSong", async (id: string) => {
  const { data: songs } = await supabase.from("song").select().eq("id", id);
  const song = songs?.at(0);

  return song as Song;
});

export const { playToggle, pushHistory, popHistory, pushQueue, shiftQueue, putRandomSongFirstInQueue } =
  playerSlice.actions;

export default playerSlice.reducer;
