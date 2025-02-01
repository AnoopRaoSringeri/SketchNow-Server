import { Request, Response } from "express";
import fs from "fs";

import { AppConfig } from "../configs";
import {
  ChartDataRequest,
  ChartDataUpdateRequest,
} from "../models/helper-models/visualize";
import { DuckDBService } from "../services/db";
import { GetChartData } from "../utils/data-processor";
import { tryCatch } from "../utils/try-catch";

const Upload = tryCatch(async (req: Request, res: Response) => {
  const { id } = req.body;

  await DuckDBService.createTableFromCsv(id);

  const columns = await DuckDBService.getColumnSchema(id);

  const result = await DuckDBService.executeQuery(`SELECT * FROM '${id}';`);

  const tableData = await result.getRowObjectsJson();
  fs.unlink(`${AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
    //
  });
  res.json({
    data: tableData,
    columns,
    id,
  });
});

const UpdateData = tryCatch(
  async (
    req: Request<{}, {}, ChartDataUpdateRequest, { isFirstRowHeader: string }>,
    res: Response,
  ) => {
    const { id, mode } = req.body;
    const { isFirstRowHeader } = req.query;

    if (mode === "truncate") {
      await DuckDBService.truncateTable(id);
    }
    await DuckDBService.insertDataFromCsv(id, isFirstRowHeader === "true");

    const result = await DuckDBService.executeQuery(`SELECT * FROM '${id}';`);

    const tableData = await result.getRowObjectsJson();
    fs.unlink(`${AppConfig.ChartsDataPath}/${id}-tmp.csv`, () => {
      //
    });
    res.json({
      data: tableData,
      id,
    });
  },
);

const GetData = tryCatch(
  async (req: Request<{}, {}, ChartDataRequest>, res: Response) => {
    const { id, measures, dimensions, columns } = req.body;

    const result = await DuckDBService.executeQuery(
      `SELECT ${columns.map((c) => `"${c.name}"`).join(", ")} FROM '${id}';`,
    );

    const tableData = await result.getRowObjectsJson();

    res.json({
      data: GetChartData(tableData, dimensions, measures),
    });
  },
);

export { GetData, UpdateData, Upload };
