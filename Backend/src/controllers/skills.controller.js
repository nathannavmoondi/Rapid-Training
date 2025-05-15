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
class CustomersController {
    constructor() {
        this.getAllCustomers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching all customers...');
                const result = yield database_service_1.db.query('SELECT * FROM customers');
                res.json(result.rows);
            }
            catch (error) {
                console.error('Error fetching customers:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                res.status(500).json({ error: `Internal server error: ${errorMessage}` });
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
