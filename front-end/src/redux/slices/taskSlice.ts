import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TaskStatuses } from '../../constants/TaskStatuses.enum';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatuses;
  order: number;
}

interface TaskState {
  tasks: Task[];
  loadingStatus: 'idle' | 'loading' | 'failed';
}

const initialState: TaskState = {
  tasks: [],
  loadingStatus: 'idle',
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${url}/tasks`);
  return (await response.json()) as Task[];
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({
    id,
    status,
    order,
  }: {
    id: number;
    status: TaskStatuses;
    order: number;
  }) => {
    const url = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${url}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, order }),
    });
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    return { id, status, order };
  }
);

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
      });
  },
});

export default taskSlice.reducer;
