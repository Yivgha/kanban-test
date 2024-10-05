import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import statusReducer from './slices/statusSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    statuses: statusReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
