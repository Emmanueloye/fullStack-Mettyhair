import { createSlice } from '@reduxjs/toolkit';

interface InitialStateType {
  isAdminSidebarOpen: boolean;
}

const initialState: InitialStateType = {
  isAdminSidebarOpen: false,
};

const adminUISlice = createSlice({
  name: 'adminUI',
  initialState,
  reducers: {
    toggleAdiminSidebar(state) {
      state.isAdminSidebarOpen = !state.isAdminSidebarOpen;
    },
    closeAdminSidebar(state) {
      state.isAdminSidebarOpen = false;
    },
  },
});

export const adminUIActions = adminUISlice.actions;
export default adminUISlice.reducer;
