import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  serverOnline: boolean;
}

const initialState: AppState = {
  serverOnline: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setServerOnline(state, action: PayloadAction<boolean>) {
      state.serverOnline = action.payload;
    },
  },
});

export const { setServerOnline } = appSlice.actions;
export default appSlice.reducer;
