import { createSlice } from '@reduxjs/toolkit';
import {
  fetchKanbans,
  addKanban,
  editKanban,
  deleteKanban,
} from '../../api/kanbans';
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
      // Handle fetchKanbans
      .addCase(fetchKanbans.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(fetchKanbans.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.kanbans = action.payload;
      })
      .addCase(fetchKanbans.rejected, (state) => {
        state.loadingStatus = 'failed';
      })

      // Handle addKanban
      .addCase(addKanban.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(addKanban.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        state.kanbans.push(action.payload);
      })
      .addCase(addKanban.rejected, (state) => {
        state.loadingStatus = 'failed';
      })

      // Handle editKanban
      .addCase(editKanban.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(editKanban.fulfilled, (state, action) => {
        state.loadingStatus = 'idle';
        const updatedKanban = action.payload;
        const kanbanIndex = state.kanbans.findIndex(
          (kanban) => kanban.uniqueId === updatedKanban.uniqueId
        );
        if (kanbanIndex !== -1) {
          state.kanbans[kanbanIndex] = updatedKanban;
        }
      })
      .addCase(editKanban.rejected, (state) => {
        state.loadingStatus = 'failed';
      })

      // Handle deleteKanban
      .addCase(deleteKanban.pending, (state) => {
        state.loadingStatus = 'loading';
      })
      .addCase(deleteKanban.fulfilled, (state, action) => {
        state.kanbans = state.kanbans.filter(
          (kanban) => kanban.uniqueId !== action.payload
        );
      })
      .addCase(deleteKanban.rejected, (state) => {
        state.loadingStatus = 'failed';
      });
  },
});

export default kanbanSlice.reducer;
