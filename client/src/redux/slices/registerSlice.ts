import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterState {
  data: RegisterData | null;
}

const initialState: RegisterState = {
  data: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterData(state, action: PayloadAction<RegisterData>) {
      state.data = action.payload;
    },
    clearRegisterData(state) {
      state.data = null;
    },
  },
});

export const { setRegisterData, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
