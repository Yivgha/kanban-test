import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Task {
  id: number;
  title: string;
  description: string;
}

interface TaskState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: TaskState = {
  tasks: [],
  status: 'idle',
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
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'idle';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default taskSlice.reducer;
