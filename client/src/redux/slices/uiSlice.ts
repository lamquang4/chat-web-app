import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ConversationTab = "all" | "unread" | "group";

interface UIState {
  sideMenuOpen: boolean;
  activeConversationTab: ConversationTab;
}

const initialState: UIState = {
  sideMenuOpen: false,
  activeConversationTab: "all",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSideMenu(state) {
      state.sideMenuOpen = !state.sideMenuOpen;
    },
    openSideMenu(state) {
      state.sideMenuOpen = true;
    },
    closeSideMenu(state) {
      state.sideMenuOpen = false;
    },
    setActiveConversationTab(state, action: PayloadAction<ConversationTab>) {
      state.activeConversationTab = action.payload;
    },
  },
});

export const {
  toggleSideMenu,
  openSideMenu,
  closeSideMenu,
  setActiveConversationTab,
} = uiSlice.actions;

export default uiSlice.reducer;
