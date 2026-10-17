import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConversationType } from "../../types/types";

export type ConversationTab = ConversationType | null;

interface UIState {
  sideBarOpen: boolean;
  activeConversationTab: ConversationTab;
}

const initialState: UIState = {
  sideBarOpen: false,
  activeConversationTab: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSideBar(state) {
      state.sideBarOpen = !state.sideBarOpen;
    },
    openSideBar(state) {
      state.sideBarOpen = true;
    },
    closeSideBar(state) {
      state.sideBarOpen = false;
    },
    setActiveConversationTab(state, action: PayloadAction<ConversationTab>) {
      state.activeConversationTab = action.payload;
    },
  },
});

export const {
  toggleSideBar,
  openSideBar,
  closeSideBar,
  setActiveConversationTab,
} = uiSlice.actions;

export default uiSlice.reducer;
