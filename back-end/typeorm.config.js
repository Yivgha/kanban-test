'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.initializeAppDataSource = exports.createDBIfNotExists = void 0;
const typeorm_1 = require('typeorm');
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config({ path: '../.env' });
const baseDataSourceConfig = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT, 10),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};
// Function to check if a database exists
const checkDatabaseExists = async (dbName) => {
  const tempDataSource = new typeorm_1.DataSource({
    ...baseDataSourceConfig,
    database: 'postgres', // Connect to the default database
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
exports.createDBIfNotExists = createDBIfNotExists;
const initializeAppDataSource = async () => {
  try {
    await (0, exports.createDBIfNotExists)(baseDataSourceConfig.database);
    const dataSource = new typeorm_1.DataSource({
      ...baseDataSourceConfig,
    });
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
exports.initializeAppDataSource = initializeAppDataSource;
