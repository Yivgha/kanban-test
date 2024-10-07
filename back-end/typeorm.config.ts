import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { Task } from './src/entities/Task';
import { Status } from './src/entities/TaskStatus';
import { Kanban } from './src/entities/Kanban';

dotenv.config({ path: '../.env' });

export const baseDataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.PGHOST as string,
  port: parseInt(process.env.PGPORT as string, 10),
  username: process.env.PGUSER as string,
  password: process.env.PGPASSWORD as string,
  database: process.env.PGDATABASE as string,
  synchronize: false,
  entities: [Kanban, Task, Status],
  migrations: ['dist/src/migrations/*.js'],
};

// Create the DataSource instance that will be exported for migrations
export const AppDataSource = new DataSource(baseDataSourceConfig);

// Initialize the AppDataSource
export const initializeAppDataSource = async (): Promise<DataSource | null> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
    return AppDataSource;
  } catch (error) {
    console.error('Failed to initialize data source:', error);
    return null;
  }
};

// Run migrations
export const runMigrations = async (): Promise<void | null> => {
  try {
    await AppDataSource.runMigrations();
    console.log('Migrations ran successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    return;
  }
};
