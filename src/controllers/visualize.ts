import { parse } from "csv-parse";
import { Request, Response } from "express";
import fs from "fs";
import { finished, pipeline } from "stream/promises";
import {
  ChartDataRequest,
  ChartDataUpdateRequest,
  RowData,
} from "../models/helper-models/visualize";
import { GetChartData } from "../utils/data-processor";
import { AppConfig } from "../configs";
import { stringify } from "csv-stringify";

const Upload = async (req: Request, res: Response) => {
  const { id } = req.body;
  // Parse the CSV content
  const records: Record<string, string>[] = [];
  let headers: string[] = [];
  let rowCount = 0;
  const parser = fs
    .createReadStream(`${AppConfig.ChartsDataPath}/${id}.csv`)
    .pipe(
      parse({
        // CSV options if any
      }),
    );
  parser.on("readable", () => {
    let record: string[] = [];
    while ((record = parser.read()) !== null) {
      if (rowCount == 0) {
        headers = record;
      } else {
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = record[i];
        });
        records.push(row);
      }
      rowCount++;
    }
  });
  await finished(parser);
  res.json({
    data: GetChartData(records, [], []),
    columns: headers,
    id,
  });
};

const UpdateData = async (
  req: Request<{}, {}, ChartDataUpdateRequest>,
  res: Response,
) => {
  try {
    const { id, mode } = req.body;
    // Parse the CSV content
    const records: Record<string, string>[] = [];
    let headers: string[] = [];
    let rowCount = 0;
    const parser = fs
      .createReadStream(`${AppConfig.ChartsDataPath}/${id}-tmp.csv`)
      .pipe(
        parse({
          from: mode == "truncate" ? undefined : 1,
          // CSV options if any
        }),
      );

    const stringifier = stringify();
    parser.on("readable", () => {
      let record: string[] = [];
      while ((record = parser.read()) !== null) {
        if (rowCount == 0) {
          headers = record;
          if (mode == "truncate") {
            stringifier.write(record);
          }
        } else {
          stringifier.write(record);
          const row: Record<string, string> = {};
          headers.forEach((h, i) => {
            row[h] = record[i];
          });
          records.push(row);
        }
        rowCount++;
      }
    });
    await finished(parser);
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
    res.json({ data: GetChartData(records, [], []), columns: headers });
  } catch (error) {
    res.json({ error });
  }
};

const GetData = async (
  req: Request<{}, {}, ChartDataRequest>,
  res: Response,
) => {
  try {
    const { id, measures, dimensions, columns } = req.body;
    // Parse the CSV content
    const records: RowData[] = [];
    let headers: string[] = [];
    let rowCount = 0;
    const uploadPath = `${AppConfig.ChartsDataPath}/${id}.csv`;
    if (fs.existsSync(uploadPath)) {
      const parser = fs.createReadStream(uploadPath).pipe(
        parse({
          // CSV options if any
        }),
      );
      parser.on("readable", () => {
        let record: string[] = [];
        while ((record = parser.read()) !== null) {
          if (rowCount == 0) {
            headers = record;
          } else {
            const row: RowData = {};
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
      await finished(parser);
    }
    if (columns.length > 1) {
      res.json({
        data: GetChartData(records, dimensions, measures),
        columns: headers,
      });
    } else {
      res.json({
        data: [],
        columns: headers,
      });
    }
  } catch (error) {
    res.json({ error });
  }
};

export { GetData, Upload, UpdateData };
