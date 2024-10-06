import { Request, Response } from 'express';
import { AppDataSource } from '../../typeorm.config';
import { Kanban } from '../entities/Kanban';

export async function getKanbans(req: Request, res: Response): Promise<void> {
  try {
    const kanbans: Kanban[] = await AppDataSource.getRepository(Kanban).find({
      relations: ['tasks'],
    });

    const response = kanbans.map(({ id, ...rest }) => rest);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching kanbans:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getKanbanByUniqueId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { uniqueId } = req.params;

    const kanban: Kanban | null = await AppDataSource.getRepository(
      Kanban
    ).findOne({
      where: { uniqueId },
      relations: ['tasks'],
    });

    if (!kanban) {
      res.status(404).json({ error: 'Kanban not found' });
      return;
    }

    res.status(200).json(kanban);
  } catch (error) {
    console.error('Error fetching Kanban:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function createKanban(req: Request, res: Response): Promise<void> {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Kanban name is required' });
      return;
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

export async function editKanban(req: Request, res: Response): Promise<void> {
  try {
    const { uniqueId } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'New Kanban name is required' });
      return;
    }

    const kanbanRepository = AppDataSource.getRepository(Kanban);
    const kanban = await kanbanRepository.findOneBy({
      uniqueId: uniqueId,
    });

    if (!kanban) {
      res.status(404).json({ error: 'Kanban not found' });
      return;
    }

    kanban.name = name;
    const updatedKanban = await kanbanRepository.save(kanban);

    res.status(200).json(updatedKanban);
  } catch (error) {
    console.error('Error updating Kanban:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function deleteKanban(req: Request, res: Response): Promise<void> {
  try {
    const { uniqueId } = req.params;

    const kanbanRepository = AppDataSource.getRepository(Kanban);
    const kanban = await kanbanRepository.findOneBy({
      uniqueId: uniqueId,
    });

    if (!kanban) {
      res.status(404).json({ error: 'Kanban not found' });
      return;
    }

    await kanbanRepository.remove(kanban);

    res
      .status(204)
      .json({ message: `Deleted kanban with unique id ${uniqueId}` });
  } catch (error) {
    console.error('Error deleting Kanban:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
