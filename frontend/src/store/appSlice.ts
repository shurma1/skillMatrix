import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  serverOnline: boolean;
  isRefreshingTokens: boolean;
}

const initialState: AppState = {
  serverOnline: true,
  isRefreshingTokens: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setServerOnline(state, action: PayloadAction<boolean>) {
      state.serverOnline = action.payload;
    },
    setRefreshingTokens(state, action: PayloadAction<boolean>) {
      state.isRefreshingTokens = action.payload;
    },
  },
});

export const { setServerOnline, setRefreshingTokens } = appSlice.actions;
export default appSlice.reducer;
