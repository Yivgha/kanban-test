import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  deleteTask,
  editTask,
} from '../handlers/tasks';

const taskRouter = Router();

taskRouter.get('/', getTasks);

taskRouter.get('/:id', getTaskById);

taskRouter.post('/', createTask);

taskRouter.put('/:id', editTask);

taskRouter.delete('/:id', deleteTask);

export default taskRouter;
