'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.runMigrations =
  exports.initializeAppDataSource =
  exports.AppDataSource =
  exports.baseDataSourceConfig =
    void 0;
const typeorm_1 = require('typeorm');
const dotenv_1 = __importDefault(require('dotenv'));
const Task_1 = require('./src/entities/Task');
const TaskStatus_1 = require('./src/entities/TaskStatus');
dotenv_1.default.config({ path: '../.env' });
exports.baseDataSourceConfig = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT, 10),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  entities: [Task_1.Task, TaskStatus_1.Status],
  migrations: ['dist/src/migrations/*.js'],
};
// Create the DataSource instance that will be exported for migrations
exports.AppDataSource = new typeorm_1.DataSource(exports.baseDataSourceConfig);
// Function to check if a database exists
const checkDatabaseExists = async (dbName) => {
  const tempDataSource = new typeorm_1.DataSource({
    ...exports.baseDataSourceConfig,
    database: 'postgres',
  });
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
const createDBIfNotExists = async (dbName) => {
  const exists = await checkDatabaseExists(dbName);
  if (exists) {
    console.log(`Database "${dbName}" already exists. No action taken.`);
    return;
  }
  const tempDataSource = new typeorm_1.DataSource({
    ...exports.baseDataSourceConfig,
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
const initializeAppDataSource = async () => {
  try {
    await createDBIfNotExists(exports.baseDataSourceConfig.database);
    await exports.AppDataSource.initialize();
    console.log('Database connection established successfully');
    return exports.AppDataSource;
  } catch (error) {
    console.error('Failed to initialize data source:', error);
    return null;
  }
};
exports.initializeAppDataSource = initializeAppDataSource;
const runMigrations = async () => {
  try {
    await exports.AppDataSource.runMigrations();
    console.log('Migrations ran successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    return;
  }
};
exports.runMigrations = runMigrations;
