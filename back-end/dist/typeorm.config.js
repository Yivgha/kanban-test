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
const Kanban_1 = require('./src/entities/Kanban');
dotenv_1.default.config({ path: '../.env' });
exports.baseDataSourceConfig = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT, 10),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  synchronize: false,
  entities: [Kanban_1.Kanban, Task_1.Task, TaskStatus_1.Status],
  migrations: ['dist/src/migrations/*.js'],
};
// Create the DataSource instance that will be exported for migrations
exports.AppDataSource = new typeorm_1.DataSource(exports.baseDataSourceConfig);
// Initialize the AppDataSource
const initializeAppDataSource = async () => {
  try {
    await exports.AppDataSource.initialize();
    console.log('Database connection established successfully');
    return exports.AppDataSource;
  } catch (error) {
    console.error('Failed to initialize data source:', error);
    return null;
  }
};
exports.initializeAppDataSource = initializeAppDataSource;
// Run migrations
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
