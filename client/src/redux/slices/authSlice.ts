import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthView = "login" | "register" | "otp";

interface AuthState {
  view: AuthView;
}

const initialState: AuthState = {
  view: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthView(state, action: PayloadAction<AuthView>) {
      state.view = action.payload;
    },
  },
});

export const { setAuthView } = authSlice.actions;
export default authSlice.reducer;
