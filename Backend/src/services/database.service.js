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
exports.db = void 0;
const database_1 = require("../config/database");
class DatabaseService {
    constructor() {
        this.pool = database_1.pool;
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this.query('SELECT 1 as value');
                return ((_a = result.rowCount) !== null && _a !== void 0 ? _a : 0) > 0;
            }
            catch (error) {
                console.error('Test connection failed:', error);
                return false;
            }
        });
    }
    query(queryText, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Executing query:', queryText, params);
                const result = yield this.pool.query(queryText, params);
                return result;
            }
            catch (error) {
                const err = error;
                console.error('Query error:', {
                    message: err.message,
                    query: queryText,
                    params
                });
                throw error;
            }
        });
    }
}
exports.db = DatabaseService.getInstance();
