import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeAppDataSource, runMigrations } from './typeorm.config';
import tasksRouter from './src/routes/tasks';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

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
  res.send('Hello, world! Test 1.1.8');
});
