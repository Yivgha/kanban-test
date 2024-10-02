import { Request, Response } from 'express';
import { AppDataSource } from '../../typeorm.config';
import { Task } from '../entities/Task';

interface NewTask {
  title: string;
  description?: string;
}

interface TaskShow {
  id: number;
  title: string;
  description?: string;
}

export async function getTasks(req: Request, res: Response) {
  try {
    const tasks: TaskShow[] = await AppDataSource.getRepository(Task).find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getTaskById(req: Request, res: Response) {
  try {
    const taskId = Number(req.params.id);

    const task: TaskShow | null = await AppDataSource.getRepository(
      Task
    ).findOneBy({
      id: taskId,
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(`Error fetching task by id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createTask(req: Request, res: Response) {
  try {
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
    }

    const taskRepository = AppDataSource.getRepository(Task);
    const createdTask: NewTask = taskRepository.create({ title, description });
    const result: TaskShow = await taskRepository.save(createdTask);

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function editTask(req: Request, res: Response) {
  try {
    const taskId: number = Number(req.params.id);

    if (!taskId) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }

    const task: Task | null = await AppDataSource.getRepository(Task).findOneBy(
      {
        id: taskId,
      }
    );

    if (!task) {
      res.status(404).json({ error: `Task with id ${taskId} not found` });
      return;
    }

    const { id, ...taskUpdates } = req.body;

    const updatedTask: Task = AppDataSource.getRepository(Task).merge(
      task,
      taskUpdates
    );

    const result: Task =
      await AppDataSource.getRepository(Task).save(updatedTask);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error editing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteTask(req: Request, res: Response) {
  try {
    const task = await AppDataSource.getRepository(Task).delete(req.params.id);

    res.send(task);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ detail: 'Internal Server Error' });
  }
}
