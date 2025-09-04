import { Request, Response } from "express";
import fs from "fs";

import { AppConfig } from "../configs";
import {
  ChartDataRequest,
  ChartDataUpdateRequest,
} from "../models/helper-models/visualize";
import { DuckDBService } from "../services/db";
import { QueryGenerator } from "../utils/chart-query-generator";
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
    papaginatedData: { data: tableData, totalRowCount: tableData.length },
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
      papaginatedData: { data: tableData, totalRowCount: tableData.length },
      id,
    });
  },
);

const GetData = tryCatch(
  async (
    req: Request<{}, {}, ChartDataRequest, { page: number }>,
    res: Response,
  ) => {
    const { page } = req.query;
    const generator = new QueryGenerator(req.body, page);

    const rowCountQueryRes = await DuckDBService.executeQuery(
      generator.generateCountQuery(),
    );
    const rowCountData = await rowCountQueryRes.getRows();
    const rowCount = Number(rowCountData[0][0]?.toString() ?? 0);
    const result = await DuckDBService.executeQuery(generator.generate());
    const tableData = await result.getRowObjectsJson();

    res.json({
      paginatedData: {
        data: tableData,
        totalRowCount: rowCount,
        page: generator.Page,
      },
    });
  },
);

const GetSourceData = tryCatch(
  async (
    req: Request<{ sourceId: string }, {}, ChartDataRequest>,
    res: Response,
  ) => {
    const id = req.params.sourceId;
    const result = await DuckDBService.executeQuery(`SELECT * FROM '${id}';`);

    const tableData = await result.getRowObjectsJson();

    res.json(tableData);
  },
);

export { GetData, GetSourceData, UpdateData, Upload };
