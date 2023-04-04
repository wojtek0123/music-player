// eslint-disable-next-line import/named
import { Session } from "@supabase/supabase-js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../helpers/supabase";

export interface IAuth {
  session: Session | null;
  status: "idle" | "loading" | "failed" | "succeeded";
}

const initialState: IAuth = {
  session: null,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, actions) => {
      state.session = actions.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getSession.fulfilled, (state, actions) => {
      state.status = "succeeded";
      state.session = actions.payload;
    });
    builder.addCase(getSession.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getSession.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const getSession = createAsyncThunk("auth/getSession", async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
});

export const { setSession } = authSlice.actions;

export default authSlice.reducer;
