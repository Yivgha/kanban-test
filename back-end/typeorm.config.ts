import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

type BaseDatabaseConfig = {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

const baseDataSourceConfig: BaseDatabaseConfig = {
  type: 'postgres',
  host: process.env.PGHOST as string,
  port: parseInt(process.env.PGPORT as string, 10),
  username: process.env.PGUSER as string,
  password: process.env.PGPASSWORD as string,
  database: process.env.PGDATABASE as string,
};

// Function to check if a database exists
const checkDatabaseExists = async (dbName: string): Promise<boolean> => {
  const tempDataSource = new DataSource({
    ...baseDataSourceConfig,
    database: 'postgres', // Connect to the default database
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

export const createDBIfNotExists = async (dbName: string): Promise<void> => {
  const exists = await checkDatabaseExists(dbName);

  if (exists) {
    console.log(`Database "${dbName}" already exists. No action taken.`);
    return;
  }

  const tempDataSource = new DataSource({
    ...baseDataSourceConfig,
    database: 'postgres',
  } as DataSourceOptions);

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

export const initializeAppDataSource = async (): Promise<DataSource | null> => {
  try {
    await createDBIfNotExists(baseDataSourceConfig.database);

    const dataSource = new DataSource({
      ...baseDataSourceConfig,
    } as DataSourceOptions);

    await dataSource.initialize();
    console.log('Database connection established successfully');

    return dataSource;
  } catch (error) {
    console.error(
      `Failed to connect to PostgreSQL server: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
};
