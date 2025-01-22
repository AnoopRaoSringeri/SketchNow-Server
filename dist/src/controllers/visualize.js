"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = exports.UpdateData = exports.GetData = void 0;
const csv_parse_1 = require("csv-parse");
const csv_stringify_1 = require("csv-stringify");
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("stream/promises");
const configs_1 = require("../configs");
const data_processor_1 = require("../utils/data-processor");
const Upload = async (req, res) => {
    const { id } = req.body;
    // Parse the CSV content
    const records = [];
    let headers = [];
    let rowCount = 0;
    const parser = fs_1.default
        .createReadStream(`${configs_1.AppConfig.ChartsDataPath}/${id}.csv`)
        .pipe((0, csv_parse_1.parse)({
    // CSV options if any
    }));
    parser.on("readable", () => {
        let record = [];
        while ((record = parser.read()) !== null) {
            if (rowCount == 0) {
                headers = record;
            }
            else {
                const row = {};
                headers.forEach((h, i) => {
                    row[h] = record[i];
                });
                records.push(row);
            }
            rowCount++;
        }
    });
    await (0, promises_1.finished)(parser);
    res.json({
        data: (0, data_processor_1.GetChartData)(records, [], []),
        columns: headers,
        id,
    });
};
exports.Upload = Upload;
const UpdateData = async (req, res) => {
    try {
        const { id, mode } = req.body;
        // Parse the CSV content
        const records = [];
        let headers = [];
        let rowCount = 0;
        const parser = fs_1.default
            .createReadStream(`${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`)
            .pipe((0, csv_parse_1.parse)({
            from: mode == "truncate" ? undefined : 1,
            // CSV options if any
        }));
        const stringifier = (0, csv_stringify_1.stringify)();
        parser.on("readable", () => {
            let record = [];
            while ((record = parser.read()) !== null) {
                if (rowCount == 0) {
                    headers = record;
                    if (mode == "truncate") {
                        stringifier.write(record);
                    }
                }
                else {
                    stringifier.write(record);
                    const row = {};
                    headers.forEach((h, i) => {
                        row[h] = record[i];
                    });
                    records.push(row);
                }
                rowCount++;
            }
        });
        await (0, promises_1.finished)(parser);
        const writableStream = fs_1.default.createWriteStream(`${configs_1.AppConfig.ChartsDataPath}/${id}.csv`, {
            flags: mode == "truncate" ? "w" : "a",
        });
        stringifier.pipe(writableStream);
        stringifier.end();
        fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
            //
        });
        res.json({ data: (0, data_processor_1.GetChartData)(records, [], []), columns: headers });
    }
    catch (error) {
        res.json({ error });
    }
};
exports.UpdateData = UpdateData;
const GetData = async (req, res) => {
    try {
        const { id, measures, dimensions, columns } = req.body;
        // Parse the CSV content
        const records = [];
        let headers = [];
        let rowCount = 0;
        const uploadPath = `${configs_1.AppConfig.ChartsDataPath}/${id}.csv`;
        if (fs_1.default.existsSync(uploadPath)) {
            const parser = fs_1.default.createReadStream(uploadPath).pipe((0, csv_parse_1.parse)({
            // CSV options if any
            }));
            parser.on("readable", () => {
                let record = [];
                while ((record = parser.read()) !== null) {
                    if (rowCount == 0) {
                        headers = record;
                    }
                    else {
                        const row = {};
                        headers.forEach((h, i) => {
                            row[h] =
                                record[i] != null || isNaN(Number(record[i]))
                                    ? record[i]
                                    : Number.parseInt(record[i]);
                        });
                        records.push(row);
                    }
                    rowCount++;
                }
            });
            await (0, promises_1.finished)(parser);
        }
        if (columns.length > 1) {
            res.json({
                data: (0, data_processor_1.GetChartData)(records, dimensions, measures),
                columns: headers,
            });
        }
        else {
            res.json({
                data: [],
                columns: headers,
            });
        }
    }
    catch (error) {
        res.json({ error });
    }
};
exports.GetData = GetData;
