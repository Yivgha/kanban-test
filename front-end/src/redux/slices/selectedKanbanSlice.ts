import { createSlice } from '@reduxjs/toolkit';

const selectedKanbanSlice = createSlice({
  name: 'selectedKanban',
  initialState: {
    id: null,
  },
  reducers: {
    setSelectedKanbanId(state, action) {
      state.id = action.payload;
    },
  },
});

export const { setSelectedKanbanId } = selectedKanbanSlice.actions;
export default selectedKanbanSlice.reducer;
