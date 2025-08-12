import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { baseApi } from './baseApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => 
    getDefault({
      serializableCheck: {
        // Ignore all RTK Query actions since they can contain non-serializable data like Blobs
        ignoredActions: [
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected', 
          'api/executeQuery/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
          'api/executeMutation/pending',
        ],
        ignoredActionsPaths: [
          'payload', 
          'payload.data', 
          'error', 
          'meta.baseQueryMeta'
        ],
        ignoredPaths: [
          // Ignore RTK Query cache state entirely
          'api',
        ],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
