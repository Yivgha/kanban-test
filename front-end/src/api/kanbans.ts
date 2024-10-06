import { createAsyncThunk } from '@reduxjs/toolkit';
import { Kanban } from '../redux/slices/kanbanSlice';

const url = process.env.REACT_APP_BACKEND_URL;

const fetchKanbans = createAsyncThunk('kanbans/fetchKanbans', async () => {
  const response = await fetch(`${url}/kanbans`);

  if (!response.ok) {
    throw new Error('Failed to fetch kanbans');
  }

  return (await response.json()) as Kanban[];
});

export { fetchKanbans };
