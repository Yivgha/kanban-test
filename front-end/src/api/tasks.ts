import { createAsyncThunk } from '@reduxjs/toolkit';
import { TaskStatuses } from '../constants/TaskStatuses.enum';
import { Task } from '../redux/slices/taskSlice';

const url = process.env.REACT_APP_BACKEND_URL;

const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch(`${url}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return (await response.json()) as Task[];
});

const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async (payload: { id: number; status: TaskStatuses; order: number }) => {
    const response = await fetch(`${url}/tasks/${payload.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: payload.status,
        order: payload.order,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task status');
    }

    return { ...payload, status: payload.status };
  }
);

const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: Omit<Task, 'id'>) => {
    const response = await fetch(`${url}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return (await response.json()) as Task;
  }
);

const editTask = createAsyncThunk('tasks/editTask', async (task: Task) => {
  const response = await fetch(`${url}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to edit task');
  }

  return (await response.json()) as Task;
});

const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number) => {
  const response = await fetch(`${url}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delte task');
  }
  return id;
});

export { fetchTasks, updateTaskStatus, createTask, deleteTask, editTask };
