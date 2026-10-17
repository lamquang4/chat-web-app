import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthView = "login" | "register" | "otp";

interface AuthViewState {
  view: AuthView;
}

const initialState: AuthViewState = {
  view: "login",
};

const authViewSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthView(state, action: PayloadAction<AuthView>) {
      state.view = action.payload;
    },
  },
});

export const { setAuthView } = authViewSlice.actions;
export default authViewSlice.reducer;
