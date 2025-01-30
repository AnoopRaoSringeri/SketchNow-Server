"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = exports.UpdateData = exports.GetData = void 0;
const fs_1 = __importDefault(require("fs"));
const configs_1 = require("../configs");
const db_1 = require("../services/db");
const data_processor_1 = require("../utils/data-processor");
const Upload = async (req, res) => {
    const { id } = req.body;
    await db_1.DuckDBService.createTableFromCsv(id);
    const columns = await db_1.DuckDBService.getColumnSchema(id);
    const result = await db_1.DuckDBService.executeQuery(`SELECT * FROM '${id}';`);
    const tableData = await result.getRowObjectsJson();
    fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
        //
    });
    res.json({
        data: tableData,
        columns,
        id,
    });
};
exports.Upload = Upload;
const UpdateData = async (req, res) => {
    try {
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
            data: tableData,
            id,
        });
    }
    catch (error) {
        res.json({ error });
    }
};
exports.UpdateData = UpdateData;
const GetData = async (req, res) => {
    try {
        const { id, measures, dimensions, columns } = req.body;
        const result = await db_1.DuckDBService.executeQuery(`SELECT ${columns.map((c) => `"${c.name}"`).join(", ")} FROM '${id}';`);
        const tableData = await result.getRowObjectsJson();
        res.json({
            data: (0, data_processor_1.GetChartData)(tableData, dimensions, measures),
        });
    }
    catch (error) {
        res.json({ error });
    }
};
exports.GetData = GetData;
