import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isModalOpen: boolean;
  isSidebarOpen: boolean;
  tabIndex: number;
  isSubmenuOpen: boolean;
  position: {
    center: number;
    top: number;
  };
}

const initialState: UIState = {
  isModalOpen: false,
  isSidebarOpen: false,
  tabIndex: 0,
  isSubmenuOpen: false,
  position: { center: 0, top: 0 },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpen = true;
    },
    closeModal(state) {
      state.isModalOpen = false;
    },
    openSideBar(state) {
      state.isSidebarOpen = true;
    },
    closeSideBar(state) {
      state.isSidebarOpen = false;
    },
    setTabIndex(state, actions: PayloadAction<number>) {
      state.tabIndex = actions.payload;
    },
    setSubmenPosition(
      state,
      action: PayloadAction<{ center: number; top: number }>
    ) {
      state.position = action.payload;
    },
    openSubmenu(state) {
      state.isSubmenuOpen = true;
    },
    closeSubmenu(state) {
      state.isSubmenuOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
