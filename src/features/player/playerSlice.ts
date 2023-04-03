import { createSlice } from "@reduxjs/toolkit";
import { Song } from "../../helpers/types";

export interface PlayerState {
  currentSong?: Song;
  isPlaying: boolean;
  queue: Array<Song>;
  history: Array<Song>;
}

const initialState: PlayerState = {
  currentSong: undefined,
  isPlaying: false,
  queue: [],
  history: [],
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playToggle: (state) => {
      state.isPlaying = !state.isPlaying;
    },
  },
});

// Action creators are generated for each case reducer function
export const { playToggle } = playerSlice.actions;

export default playerSlice.reducer;
