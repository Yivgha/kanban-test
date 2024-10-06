import { Request, Response } from 'express';
import { AppDataSource } from '../../typeorm.config';
import { Task } from '../entities/Task';
import { Kanban } from '../entities/Kanban';
import { TaskStatus } from '../enums/TaskStatus.enum';

interface TaskShow {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  order?: number;
  kanban: number | null;
}

export async function getTasks(req: Request, res: Response): Promise<void> {
  try {
    const tasks: Task[] = await AppDataSource.getRepository(Task).find({
      relations: ['kanban'],
    });

    const taskResponses: TaskShow[] = tasks.map((task) => ({
      ...task,
      kanban: task.kanban ? task.kanban.id : null,
    }));

    res.status(200).json(taskResponses);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  try {
    const taskId = Number(req.params.id);

    const task = await AppDataSource.getRepository(Task).findOne({
      where: { id: taskId },
      relations: ['kanban'],
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const taskResponse: TaskShow = {
      ...task,
      kanban: task.kanban ? task.kanban.id : null,
    };

    res.status(200).json(taskResponse);
  } catch (error) {
    console.error(`Error fetching task by id ${req.params.id}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, status, order, kanbanId } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    if (!kanbanId) {
      res.status(400).json({ error: 'Kanban ID is required' });
      return;
    }

    const kanbanRepository = AppDataSource.getRepository(Kanban);
    const kanban = await kanbanRepository.findOne({ where: { id: kanbanId } });

    if (!kanban) {
      res.status(404).json({ error: 'Kanban not found' });
      return;
    }

    const taskRepository = AppDataSource.getRepository(Task);
    const createdTask = taskRepository.create({
      title,
      description,
      status,
      order,
      kanban: kanban,
    });

    const result = await taskRepository.save(createdTask);

    const taskResponse: TaskShow = {
      ...result,
      kanban: result.kanban ? result.kanban.id : null,
    };

    res.status(201).json(taskResponse);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export async function editTask(req: Request, res: Response): Promise<void> {
  try {
    const taskId: number = Number(req.params.id);

    if (!taskId) {
      res.status(400).json({ error: 'Id is required' });
      return;
    }

    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({ where: { id: taskId } });

    if (!task) {
      res.status(404).json({ error: `Task with id ${taskId} not found` });
      return;
    }

    const { id, ...taskUpdates } = req.body;

    const updatedTask = taskRepository.merge(task, taskUpdates);
    const result = await taskRepository.save(updatedTask);

    const taskResponse: TaskShow = {
      ...result,
      kanban: result.kanban ? result.kanban.id : null,
    };

    res.status(200).json(taskResponse);
  } catch (error) {
    console.error('Error editing task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    await AppDataSource.getRepository(Task).delete(req.params.id);

    res.status(200).json({ message: `Task with id ${req.params.id} deleted!` });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ detail: 'Internal Server Error' });
  }
}
