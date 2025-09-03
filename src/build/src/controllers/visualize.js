"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = exports.UpdateData = exports.GetSourceData = exports.GetData = void 0;
const fs_1 = __importDefault(require("fs"));
const configs_1 = require("../configs");
const db_1 = require("../services/db");
const chart_query_generator_1 = require("../utils/chart-query-generator");
const try_catch_1 = require("../utils/try-catch");
const Upload = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { id } = req.body;
    await db_1.DuckDBService.createTableFromCsv(id);
    const columns = await db_1.DuckDBService.getColumnSchema(id);
    const result = await db_1.DuckDBService.executeQuery(`SELECT * FROM '${id}';`);
    const tableData = await result.getRowObjectsJson();
    fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
        //
    });
    res.json({
        papaginatedData: { data: tableData, totalRowCount: tableData.length },
        columns,
        id,
    });
});
exports.Upload = Upload;
const UpdateData = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { id, mode } = req.body;
    const { isFirstRowHeader } = req.query;
    if (mode === "truncate") {
        await db_1.DuckDBService.truncateTable(id);
    }
    await db_1.DuckDBService.insertDataFromCsv(id, isFirstRowHeader === "true");
    const result = await db_1.DuckDBService.executeQuery(`SELECT * FROM '${id}';`);
    const tableData = await result.getRowObjectsJson();
    fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
        //
    });
    res.json({
        papaginatedData: { data: tableData, totalRowCount: tableData.length },
        id,
    });
});
exports.UpdateData = UpdateData;
const GetData = (0, try_catch_1.tryCatch)(async (req, res) => {
    var _a, _b;
    const { page } = req.query;
    const generator = new chart_query_generator_1.QueryGenerator(req.body, page);
    const result = await db_1.DuckDBService.executeQuery(generator.generate());
    const tableData = await result.getRowObjectsJson();
    const rowCountQueryRes = await db_1.DuckDBService.executeQuery(generator.generateCountQuery());
    const rowCount = await rowCountQueryRes.getRows();
    res.json({
        paginatedData: {
            data: tableData,
            totalRowCount: Number((_b = (_a = rowCount[0][0]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 0),
        },
    });
});
exports.GetData = GetData;
const GetSourceData = (0, try_catch_1.tryCatch)(async (req, res) => {
    const id = req.params.sourceId;
    const result = await db_1.DuckDBService.executeQuery(`SELECT * FROM '${id}';`);
    const tableData = await result.getRowObjectsJson();
    res.json(tableData);
});
exports.GetSourceData = GetSourceData;
