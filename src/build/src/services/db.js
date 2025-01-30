"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuckDBService = void 0;
const node_api_1 = require("@duckdb/node-api");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configs_1 = require("../configs");
let duckdb = null;
class DuckDBService {
    static getDataPath(id) {
        return path_1.default.join(configs_1.AppConfig.ChartsDataPath, `${id}-tmp.csv`);
    }
    static get instance() {
        if (!duckdb) {
            throw new Error("DuckDB is not initialized");
        }
        return duckdb;
    }
    static async init() {
        try {
            await DuckDBService.create();
            console.log("DuckDB Initialized");
        }
        catch (e) {
            console.log(e);
        }
    }
    static async create() {
        if (!fs_1.default.existsSync(configs_1.AppConfig.ChartsDataPath)) {
            fs_1.default.mkdirSync(configs_1.AppConfig.ChartsDataPath);
        }
        duckdb = await node_api_1.DuckDBInstance.create(DuckDBService.dbPath);
    }
    static async connect() {
        if (!duckdb) {
            throw new Error("DuckDB is not initialized");
        }
        return duckdb.connect();
    }
    static async executeQuery(query) {
        if (!duckdb) {
            throw new Error("DuckDB is not initialized");
        }
        const connection = await DuckDBService.connect();
        const queryResult = await connection.run(query);
        await connection.run("CHECKPOINT");
        connection.close();
        return queryResult;
    }
    static async createTableFromCsv(tableName) {
        const csvPath = DuckDBService.getDataPath(tableName);
        await DuckDBService.executeQuery(`CREATE TABLE '${tableName}' AS FROM '${csvPath}'`);
    }
    static async truncateTable(tableName) {
        await DuckDBService.executeQuery(`TRUNCATE '${tableName}'`);
    }
    static async getColumnSchema(tableName) {
        var _a, _b;
        const result = await DuckDBService.executeQuery(`PRAGMA table_info('${tableName}');`);
        const tableData = await result.getColumnsJson();
        const columns = [];
        for (let i = 0; i < result.rowCount; i++) {
            columns.push({
                name: (_b = (_a = tableData[1][i]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
                type: DuckDBService.getColumnType(tableData[2][i]),
            });
        }
        return columns;
    }
    static async insertDataFromCsv(tableName, withHeder) {
        const csvPath = DuckDBService.getDataPath(tableName);
        await DuckDBService.executeQuery(`COPY '${tableName}' FROM '${csvPath}' (HEADER ${withHeder ? "TRUE" : "FALSE"})`);
    }
    static async upsertDataFromCsv(tableName, columns) {
        const csvPath = DuckDBService.getDataPath(tableName);
        await DuckDBService.executeQuery(`COPY '${tableName}' FROM '${csvPath}'`);
    }
    // #region  Helper functions
    static getColumnType(type) {
        switch (type) {
            case node_api_1.DuckDBTypeId.DATE:
                return "date";
            case node_api_1.DuckDBTypeId.DECIMAL:
            case node_api_1.DuckDBTypeId.BIGINT:
            case node_api_1.DuckDBTypeId.DOUBLE:
            case node_api_1.DuckDBTypeId.INTEGER:
            case node_api_1.DuckDBTypeId.FLOAT:
            case node_api_1.DuckDBTypeId.SMALLINT:
            case node_api_1.DuckDBTypeId.TINYINT:
            case node_api_1.DuckDBTypeId.HUGEINT:
            case node_api_1.DuckDBTypeId.UBIGINT:
            case node_api_1.DuckDBTypeId.UHUGEINT:
            case node_api_1.DuckDBTypeId.USMALLINT:
            case node_api_1.DuckDBTypeId.UTINYINT:
            case node_api_1.DuckDBTypeId.VARINT:
                return "number";
            default:
                return "string";
        }
    }
}
exports.DuckDBService = DuckDBService;
DuckDBService.dbPath = path_1.default.join(configs_1.AppConfig.ChartsDataPath, "data_now.db");
