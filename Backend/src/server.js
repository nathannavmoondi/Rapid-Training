"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const database_service_1 = require("./services/database.service");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', index_1.default);
// Health check endpoint with DB status
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dbStatus = yield database_service_1.db.testConnection();
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'Connected' : 'Disconnected'
    });
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on port ${port}`);
    // Test database connection
    try {
        const isConnected = yield database_service_1.db.testConnection();
        if (isConnected) {
            console.log('Successfully connected to the database');
        }
        else {
            console.error('Failed to connect to the database');
        }
    }
    catch (error) {
        console.error('Error testing database connection:', error);
    }
}));
