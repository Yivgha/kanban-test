import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import statusReducer from './slices/statusSlice';
import kanbanReducer from './slices/kanbanSlice';

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    statuses: statusReducer,
    kanbans: kanbanReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
