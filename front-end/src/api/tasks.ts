import { createAsyncThunk } from '@reduxjs/toolkit';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import { Task } from '../redux/slices/taskSlice';

const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${url}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return (await response.json()) as Task[];
});

const updateTaskStatus = createAsyncThunk(
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

export { fetchTasks, updateTaskStatus };
