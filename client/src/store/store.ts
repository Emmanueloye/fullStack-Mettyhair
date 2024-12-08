import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import adminUIReducer from './adminUI';
import authReducer from './authAction';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    adminUI: adminUIReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
