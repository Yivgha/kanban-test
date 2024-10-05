import { Request, Response } from 'express';
import { AppDataSource } from '../../typeorm.config';
import { Status } from '../entities/TaskStatus';

export async function getTaskStatuses(req: Request, res: Response) {
  try {
    const statuses: Status[] = await AppDataSource.getRepository(Status).find();

    res.status(200).json(statuses);
  } catch (error) {
    console.error('Error fetching task statuses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
