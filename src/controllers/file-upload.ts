import { parse } from "csv-parse";
import { Request, Response } from "express";
import fs from "fs";
import { finished } from "stream/promises";

const Upload = async (req: Request, res: Response) => {
  const { id } = req.body;
  // Parse the CSV content
  const records: Record<string, string>[] = [];
  const parser = fs.createReadStream(`src/uploads/${id}.csv`).pipe(
    parse({
      // CSV options if any
    }),
  );
  parser.on("readable", () => {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  res.json({ data: records });
};

const GetData = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Parse the CSV content
  const records: Record<string, string>[] = [];
  const path = `src/uploads/${id}.csv`;
  if (fs.existsSync(path)) {
    const parser = fs.createReadStream(`src/uploads/${id}.csv`).pipe(
      parse({
        // CSV options if any
      }),
    );
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        // Work with each record
        records.push(record);
      }
    });
    await finished(parser);
  }
  res.json({ data: records });
};

export { GetData, Upload };
