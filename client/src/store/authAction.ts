import { createSlice } from '@reduxjs/toolkit';

const initialState = { info: '', isAuth: false };

const authSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.info = action.payload;
    },
    updateAuthStatus(state, action) {
      state.isAuth = action.payload ? true : false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
