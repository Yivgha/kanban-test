"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_config_1 = require("./typeorm.config");
const tasks_1 = __importDefault(require("./src/routes/tasks"));
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express_1.default.json());
app.use('/api/tasks', tasks_1.default);
async function startServer() {
    await (0, typeorm_config_1.initializeAppDataSource)();
    await (0, typeorm_config_1.runMigrations)();
    const port = parseInt(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
}
startServer();
app.get('/', (req, res) => {
    res.send('Hello, world! Test 1.1.12');
});
