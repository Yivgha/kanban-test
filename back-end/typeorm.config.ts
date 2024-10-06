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

// Function to check if a database exists
const checkDatabaseExists = async (dbName: string): Promise<boolean> => {
  const tempDataSource = new DataSource({
    ...baseDataSourceConfig,
    database: 'postgres',
  } as DataSourceOptions);

  try {
    await tempDataSource.initialize();
    const result = await tempDataSource.query(
      `
      SELECT 1 FROM pg_database WHERE datname = $1
    `,
      [dbName]
    );
    return result.length > 0;
  } catch (error) {
    console.error(
      `Error checking database existence: ${error instanceof Error ? error.message : error}`
    );
    return false;
  } finally {
    await tempDataSource.destroy();
  }
};

const createDBIfNotExists = async (dbName: string): Promise<void> => {
  const exists = await checkDatabaseExists(dbName);

  if (exists) {
    console.log(`Database "${dbName}" already exists. No action taken.`);
    return;
  }

  const tempDataSource = new DataSource({
    ...baseDataSourceConfig,
    database: 'postgres',
  });

  try {
    await tempDataSource.initialize();
    console.log('Connected to PostgreSQL server successfully');

    await tempDataSource.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created successfully`);
  } catch (error) {
    console.error(
      `Error creating database: ${error instanceof Error ? error.message : error}`
    );
    throw error;
  } finally {
    await tempDataSource.destroy();
  }
};

// Initialize the AppDataSource after ensuring the database exists
export const initializeAppDataSource = async (): Promise<DataSource | null> => {
  try {
    await createDBIfNotExists(baseDataSourceConfig.database as string);
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
    return AppDataSource;
  } catch (error) {
    console.error('Failed to initialize data source:', error);
    return null;
  }
};

export const runMigrations = async (): Promise<void | null> => {
  try {
    await AppDataSource.runMigrations();
    console.log('Migrations ran successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    return;
  }
};
