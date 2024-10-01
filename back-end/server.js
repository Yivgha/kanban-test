'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const dotenv_1 = __importDefault(require('dotenv'));
const typeorm_config_1 = require('./typeorm.config');
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
async function startServer() {
  const AppDataSource = await (0, typeorm_config_1.initializeAppDataSource)();
  if (!AppDataSource) {
    console.error('Failed to initialize AppDataSource');
    return;
  }
  app.get('/', (req, res) => {
    res.send('Hello, world! Test 1.1.5');
  });
  const port = parseInt(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}
startServer();
