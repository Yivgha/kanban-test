import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeAppDataSource } from './typeorm.config';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());

async function startServer(): Promise<void> {
  const AppDataSource = await initializeAppDataSource();

  if (!AppDataSource) {
    console.error('Failed to initialize AppDataSource');
    return;
  }

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world! Test 1.1.5');
  });

  const port: number = parseInt(process.env.PORT as string) || 3000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

startServer();
