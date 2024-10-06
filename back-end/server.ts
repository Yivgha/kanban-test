import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeAppDataSource, runMigrations } from './typeorm.config';
import tasksRouter from './src/routes/tasks';
import taskStatusesRouter from './src/routes/taskStatuses';
import kanbanRouter from './src/routes/kanbans';

dotenv.config({ path: '../.env' });

const app = express();
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/statuses', taskStatusesRouter);
app.use('/api/kanbans', kanbanRouter);

async function startServer(): Promise<void> {
  await initializeAppDataSource();

  await runMigrations();

  const port: number = parseInt(process.env.PORT as string) || 3000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

startServer();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world! Kanban is alive!');
});
