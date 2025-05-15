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
exports.DatabaseService = void 0;
const config_1 = __importDefault(require("../config"));
class DatabaseService {
    static executeQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, params = []) {
            try {
                const client = yield config_1.default.connect();
                try {
                    const result = yield client.query(query, params);
                    return result;
                }
                finally {
                    client.release();
                }
            }
            catch (error) {
                console.error('Database query error:', error);
                throw error;
            }
        });
    }
    static getCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM customers';
            try {
                const result = yield this.executeQuery(query);
                return result.rows;
            }
            catch (error) {
                console.error('Error fetching customers:', error);
                throw error;
            }
        });
    }
    static getCustomerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM customers WHERE customer_id = $1';
            try {
                const result = yield this.executeQuery(query, [id]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error fetching customer:', error);
                throw error;
            }
        });
    }
    static searchCustomers(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT * FROM customers 
      WHERE LOWER(company_name) LIKE LOWER($1) 
      OR LOWER(contact_name) LIKE LOWER($1)
    `;
            try {
                const result = yield this.executeQuery(query, [`%${searchTerm}%`]);
                return result.rows;
            }
            catch (error) {
                console.error('Error searching customers:', error);
                throw error;
            }
        });
    }
}
exports.DatabaseService = DatabaseService;
