import { createSlice } from '@reduxjs/toolkit';
import { TaskStatuses } from '../../constants/TaskStatuses.enum';
import {
  fetchTasks,
  updateTaskStatus,
  createTask,
  deleteTask,
  editTask,
} from '../../api/tasks';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatuses;
  order?: number;
}

interface TaskState {
  tasks: Task[];
  loadingStatus: 'idle' | 'loading' | 'failed';
}

const initialState: TaskState = {
  tasks: [],
  loadingStatus: 'idle',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loadingStatus = 'failed';
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        const { id, status, order } = action.payload;
        const task = state.tasks.find((task) => task.id === id);
        if (task) {
          task.status = status;
          task.order = order;
        }
      })
      .addCase(updateTaskStatus.rejected, (state) => {
        state.loadingStatus = 'failed';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(editTask.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(editTask.rejected, (state) => {
        state.loadingStatus = 'failed';
      });
  },
});

export default taskSlice.reducer;
