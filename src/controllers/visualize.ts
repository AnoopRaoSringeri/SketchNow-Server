import e from "cors";
import { stringify } from "csv-stringify";
import { Request, Response } from "express";
import fs from "fs";
import { parse, ParseResult } from "papaparse";
import { finished } from "stream/promises";

import { AppConfig, CsvParserConfig } from "../configs";
import {
  ChartDataRequest,
  ChartDataUpdateRequest,
  ColumnConfig,
  RowData,
} from "../models/helper-models/visualize";
import { GetChartData } from "../utils/data-processor";

const Upload = async (req: Request, res: Response) => {
  const { id } = req.body;
  const path = `${AppConfig.ChartsDataPath}/${id}.csv`;
  const headers: ColumnConfig[] = [];

  const readableStream = fs.createReadStream(path);

  parse(readableStream, {
    header: true,
    transformHeader(header) {
      const exists = headers.find((h) => h.name == header);
      if (exists) return header;
      headers.push({
        name: header,
        type: "string",
      });
      return header;
    },
    transform(value, field) {
      if (!value) return value;
      const header = headers.find((h) => h.name == field);
      if (!header) return value;
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
    complete(results: ParseResult<RowData>) {
      if (results.errors.length > 0) {
        res.json({
          error: results.errors,
        });
      } else {
        res.json({
          data: results.data,
          columns: headers,
          id,
        });
      }
    },
  });
};

const UpdateData = async (
  req: Request<{}, {}, ChartDataUpdateRequest>,
  res: Response,
) => {
  try {
    const { id, mode } = req.body;
    const path = `${AppConfig.ChartsDataPath}/${id}-tmp.csv`;

    const readableStream = fs.createReadStream(path);
    const stringifier = stringify();

    parse(readableStream, {
      complete(results: ParseResult<RowData>) {
        if (results.errors.length > 0) {
          res.json({
            error: results.errors,
          });
        } else {
          results.data.forEach((record, i) => {
            if (mode == "update" && i == 0) {
              console.log("skipping header");
            } else {
              stringifier.write(record);
            }
          });
          const writableStream = fs.createWriteStream(
            `${AppConfig.ChartsDataPath}/${id}.csv`,
            {
              flags: mode == "truncate" ? "w" : "a",
            },
          );
          stringifier.pipe(writableStream);
          stringifier.end();
          fs.unlink(`${AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
            //
          });
          res.json({
            data: results.data,
            id,
          });
        }
      },
    });
  } catch (error) {
    res.json({ error });
  }
};

const GetData = async (
  req: Request<{}, {}, ChartDataRequest>,
  res: Response,
) => {
  try {
    const { id, measures, dimensions } = req.body;
    const path = `${AppConfig.ChartsDataPath}/${id}.csv`;
    const readableStream = fs.createReadStream(path);
    parse(readableStream, {
      header: true,
      complete(results: ParseResult<RowData>) {
        if (results.errors.length > 0) {
          res.json({
            error: results.errors,
          });
        } else {
          res.json({
            data: GetChartData(results.data, dimensions, measures),
          });
        }
      },
    });
  } catch (error) {
    res.json({ error });
  }
};

export { GetData, UpdateData, Upload };
