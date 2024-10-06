import { Router } from 'express';
import { getKanbans, createKanban } from '../handlers/kanbans';

const kanbanRouter = Router();

kanbanRouter.get('/', getKanbans);

kanbanRouter.post('/', createKanban);

export default kanbanRouter;
