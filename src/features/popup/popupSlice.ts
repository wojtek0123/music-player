// eslint-disable-next-line import/named
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PopupSliceState {
  visibility: { songId: string; show: boolean };
}

const initialState: PopupSliceState = {
  visibility: { songId: "", show: false },
};

const popupSlice = createSlice({
  name: "popup-menu",
  initialState,
  reducers: {
    hideMenu: (state) => {
      state.visibility = { songId: "", show: false };
    },
    toggleMenu: (state, action: PayloadAction<string>) => {
      if (action.payload === state.visibility.songId && state.visibility.show) {
        state.visibility = { songId: "", show: false };
        return;
      }

      if (action.payload !== state.visibility.songId && state.visibility.show) {
        state.visibility = { songId: action.payload, show: true };
        return;
      }

      state.visibility = { songId: action.payload, show: true };
    },
  },
});

export const { hideMenu, toggleMenu } = popupSlice.actions;

export default popupSlice.reducer;
