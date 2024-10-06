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

const addKanban = createAsyncThunk(
  'kanbans/addKanban',
  async (kanbanName: string) => {
    const response = await fetch(`${url}/kanbans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: kanbanName }),
    });

    if (!response.ok) {
      throw new Error('Failed to add kanban');
    }

    return (await response.json()) as Kanban;
  }
);

const editKanban = createAsyncThunk(
  'kanbans/editKanban',
  async ({ uniqueId, name }: { uniqueId: string; name: string }) => {
    const response = await fetch(`${url}/kanbans/${uniqueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error('Failed to edit kanban');
    }

    return (await response.json()) as Kanban;
  }
);

const deleteKanban = createAsyncThunk(
  'kanbans/deleteKanban',
  async (uniqueId: string) => {
    const response = await fetch(`${url}/kanbans/${uniqueId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete kanban');
    }

    return uniqueId;
  }
);

export { fetchKanbans, addKanban, editKanban, deleteKanban };
