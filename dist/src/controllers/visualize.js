"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = exports.UpdateData = exports.GetData = void 0;
const csv_stringify_1 = require("csv-stringify");
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = require("papaparse");
const configs_1 = require("../configs");
const data_processor_1 = require("../utils/data-processor");
const Upload = async (req, res) => {
    const { id } = req.body;
    const path = `${configs_1.AppConfig.ChartsDataPath}/${id}.csv`;
    const headers = [];
    const readableStream = fs_1.default.createReadStream(path);
    (0, papaparse_1.parse)(readableStream, {
        header: true,
        transformHeader(header) {
            const exists = headers.find((h) => h.name == header);
            if (exists)
                return header;
            headers.push({
                name: header,
                type: "string",
            });
            return header;
        },
        transform(value, field) {
            if (!value)
                return value;
            const header = headers.find((h) => h.name == field);
            if (!header)
                return value;
            if (!Number.isNaN(Number(value))) {
                header.type = "number";
                return Number(value);
            }
            if (new Date(value).toString() !== "Invalid Date") {
                header.type = "date";
                return new Date(value).toDateString();
            }
            return value;
        },
        complete(results) {
            if (results.errors.length > 0) {
                res.json({
                    error: results.errors,
                });
            }
            else {
                res.json({
                    data: results.data,
                    columns: headers,
                    id,
                });
            }
        },
    });
};
exports.Upload = Upload;
const UpdateData = async (req, res) => {
    try {
        const { id, mode } = req.body;
        const path = `${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`;
        const readableStream = fs_1.default.createReadStream(path);
        const stringifier = (0, csv_stringify_1.stringify)();
        (0, papaparse_1.parse)(readableStream, {
            complete(results) {
                if (results.errors.length > 0) {
                    res.json({
                        error: results.errors,
                    });
                }
                else {
                    results.data.forEach((record, i) => {
                        if (mode == "update" && i == 0) {
                            console.log("skipping header");
                        }
                        else {
                            stringifier.write(record);
                        }
                    });
                    const writableStream = fs_1.default.createWriteStream(`${configs_1.AppConfig.ChartsDataPath}/${id}.csv`, {
                        flags: mode == "truncate" ? "w" : "a",
                    });
                    stringifier.pipe(writableStream);
                    stringifier.end();
                    fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
                        //
                    });
                    res.json({
                        data: results.data,
                        id,
                    });
                }
            },
        });
    }
    catch (error) {
        res.json({ error });
    }
};
exports.UpdateData = UpdateData;
const GetData = async (req, res) => {
    try {
        const { id, measures, dimensions } = req.body;
        const path = `${configs_1.AppConfig.ChartsDataPath}/${id}.csv`;
        const readableStream = fs_1.default.createReadStream(path);
        (0, papaparse_1.parse)(readableStream, {
            header: true,
            complete(results) {
                if (results.errors.length > 0) {
                    res.json({
                        error: results.errors,
                    });
                }
                else {
                    res.json({
                        data: (0, data_processor_1.GetChartData)(results.data, dimensions, measures),
                    });
                }
            },
        });
    }
    catch (error) {
        res.json({ error });
    }
};
exports.GetData = GetData;
