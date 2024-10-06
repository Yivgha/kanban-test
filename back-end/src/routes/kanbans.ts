import { Router } from 'express';
import {
  getKanbans,
  createKanban,
  editKanban,
  getKanbanByUniqueId,
  deleteKanban,
} from '../handlers/kanbans';

const kanbanRouter = Router();

kanbanRouter.get('/', getKanbans);

kanbanRouter.get('/:id', getKanbanByUniqueId);

kanbanRouter.post('/', createKanban);

kanbanRouter.put('/:id', editKanban);

kanbanRouter.delete('/:id', deleteKanban);

export default kanbanRouter;
