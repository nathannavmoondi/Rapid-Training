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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const database_service_1 = require("../services/database.service");
const aiDbService_1 = require("../services/aiDbService"); // Assuming you have a service to handle SQL requests
class CustomersController {
    constructor() {
        this.getSqlStatement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var sql = yield (0, aiDbService_1.requestSqlStatement)("give me all the customers", "customer");
            res.json(sql);
        });
        this.runSqlStatement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { text } = req.params; //eg: give me all the customers
                const sql = yield (0, aiDbService_1.requestSqlStatement)(text, "customers");
                console.log('sql is >>', sql);
                const result = yield database_service_1.db.query(sql);
                res.json({
                    sql: sql,
                    results: result.rows
                });
            }
            catch (error) {
                console.error('Error executing SQL statement:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                res.status(500).json({
                    error: `Internal server error: ${errorMessage}`,
                    details: error instanceof Error ? error.stack : undefined
                });
            }
        });
        this.getAllCustomers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // First check if the table exists
                const tableCheck = yield database_service_1.db.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customers')");
                if (!tableCheck.rows[0].exists) {
                    res.status(404).json({
                        error: 'Customers table does not exist',
                        message: 'Please run the database initialization script'
                    });
                    return;
                }
                const result = yield database_service_1.db.query('SELECT * FROM customers LIMIT 10');
                console.log('Query result:', result);
                res.json(result.rows);
            }
            catch (error) {
                console.error('Error fetching customers:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                res.status(500).json({
                    error: `Internal server error: ${errorMessage}`,
                    details: error instanceof Error ? error.stack : undefined
                });
            }
        });
        this.getCustomerById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield database_service_1.db.query('SELECT * FROM customers WHERE CustomerID = $1', [id]);
                if (result.rowCount === 0) {
                    res.status(404).json({ error: 'Customer not found' });
                    return;
                }
                res.json(result.rows[0]);
            }
            catch (error) {
                console.error('Error fetching customer:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                res.status(500).json({ error: `Internal server error: ${errorMessage}` });
            }
        });
    }
}
exports.CustomersController = CustomersController;
