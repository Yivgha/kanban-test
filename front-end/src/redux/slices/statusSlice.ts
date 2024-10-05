import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Status {
  id: number;
  name: string;
}

interface StatusState {
  statuses: Status[];
  loadingStatus: 'idle' | 'loading' | 'failed';
}

const initialState: StatusState = {
  statuses: [],
  loadingStatus: 'idle',
};

// Thunk to fetch statuses from the backend
export const fetchStatuses = createAsyncThunk(
  'statuses/fetchStatuses',
  async () => {
    const url = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${url}/statuses`);
    if (!response.ok) {
      throw new Error('Failed to fetch statuses');
    }
    return (await response.json()) as Status[];
  }
);

const statusSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.statuses = action.payload;
      })
      .addCase(fetchStatuses.rejected, (state) => {
        state.loadingStatus = 'failed';
      });
  },
});

export default statusSlice.reducer;
