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
const customers_controller_1 = require("../controllers/customers.controller");
const database_service_1 = require("../services/database.service");
const router = express_1.default.Router();
const customersController = new customers_controller_1.CustomersController();
// Test database connection
router.get('/test-db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Test basic connection
        const versionResult = yield database_service_1.db.query('SELECT version()');
        // Test schema access
        const schemaResult = yield database_service_1.db.query("SELECT current_schema(), current_database()");
        // Test table listing
        const tablesResult = yield database_service_1.db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()");
        res.json({
            status: 'Connected',
            postgresVersion: ((_a = versionResult.rows[0]) === null || _a === void 0 ? void 0 : _a.version) || 'Unknown',
            currentSchema: schemaResult.rows[0],
            tables: tablesResult.rows
        });
    }
    catch (error) {
        const err = error;
        res.status(500).json({
            status: 'Error',
            message: err.message,
            stack: err.stack
        });
    }
}));
// Customer routes
router.get('/sql', (req, res) => customersController.getSqlStatement(req, res));
router.get('/sql/:prompt', (req, res) => customersController.runSqlStatement(req, res));
router.get('/customers', (req, res) => customersController.getAllCustomers(req, res));
router.get('/customers/:id', (req, res) => customersController.getCustomerById(req, res));
// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});
exports.default = router;
