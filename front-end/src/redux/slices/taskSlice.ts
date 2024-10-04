import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
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
      });
  },
});

export default taskSlice.reducer;
