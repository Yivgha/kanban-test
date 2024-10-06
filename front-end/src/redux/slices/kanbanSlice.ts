import { createSlice } from '@reduxjs/toolkit';
import { fetchKanbans } from '../../api/kanbans';
import { Task } from './taskSlice';

export interface Kanban {
  uniqueId: string;
  name: string;
  tasks: Task[];
}

interface KanbanState {
  kanbans: Kanban[];
  loadingStatus: 'idle' | 'loading' | 'failed';
}

const initialState: KanbanState = {
  kanbans: [],
  loadingStatus: 'idle',
};

const kanbanSlice = createSlice({
  name: 'kanbans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKanbans.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchKanbans.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.kanbans = action.payload;
      })
      .addCase(fetchKanbans.rejected, (state) => {
        state.loadingStatus = 'failed';
      });
  },
});

export default kanbanSlice.reducer;
