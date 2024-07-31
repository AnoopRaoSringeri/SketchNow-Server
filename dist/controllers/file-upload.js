"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = exports.GetData = void 0;
const csv_parse_1 = require("csv-parse");
const fs_1 = __importDefault(require("fs"));
const promises_1 = require("stream/promises");
const Upload = async (req, res) => {
    const { id } = req.body;
    // Parse the CSV content
    const records = [];
    const parser = fs_1.default.createReadStream(`src/uploads/${id}.csv`).pipe((0, csv_parse_1.parse)({
    // CSV options if any
    }));
    parser.on("readable", () => {
        let record;
        while ((record = parser.read()) !== null) {
            // Work with each record
            records.push(record);
        }
    });
    await (0, promises_1.finished)(parser);
    res.json({ data: records });
};
exports.Upload = Upload;
const GetData = async (req, res) => {
    const { id } = req.params;
    // Parse the CSV content
    const records = [];
    const path = `src/uploads/${id}.csv`;
    if (fs_1.default.existsSync(path)) {
        const parser = fs_1.default.createReadStream(`src/uploads/${id}.csv`).pipe((0, csv_parse_1.parse)({
        // CSV options if any
        }));
        parser.on("readable", () => {
            let record;
            while ((record = parser.read()) !== null) {
                // Work with each record
                records.push(record);
            }
        });
        await (0, promises_1.finished)(parser);
    }
    res.json({ data: records });
};
exports.GetData = GetData;
