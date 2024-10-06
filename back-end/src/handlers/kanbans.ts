import { Request, Response } from 'express';
import { AppDataSource } from '../../typeorm.config';
import { Task } from '../entities/Task';
import { Kanban } from '../entities/Kanban';

export async function getKanbans(req: Request, res: Response) {
  try {
    const kanbans: Kanban[] = await AppDataSource.getRepository(Kanban).find({
      relations: ['tasks'],
    });

    res.status(200).json(kanbans);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createKanban(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Kanban name is required' });
    }

    const newKanban = new Kanban(name);
    newKanban.tasks = [];

    const kanbanRepository = AppDataSource.getRepository(Kanban);
    const savedKanban = await kanbanRepository.save(newKanban);

    res.status(201).json(savedKanban);
  } catch (error) {
    console.error('Error creating Kanban:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
