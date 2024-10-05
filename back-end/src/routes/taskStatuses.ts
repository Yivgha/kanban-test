import { Router } from 'express';
import { getTaskStatuses } from '../handlers/taskStatuses';

const taskStatusesRouter = Router();

taskStatusesRouter.get('/', getTaskStatuses);

export default taskStatusesRouter;
