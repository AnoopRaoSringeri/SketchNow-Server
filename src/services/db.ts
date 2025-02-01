import {
  DuckDBConnection,
  DuckDBInstance,
  DuckDBTypeId,
  Json,
} from "@duckdb/node-api";
import fs from "fs";
import path from "path";

import { AppConfig } from "../configs";
import { ColumnConfig, ColumnType } from "../models/helper-models/visualize";

let duckdb: DuckDBInstance | null = null;

export class DuckDBService {
  private static dbPath: string = path.join(
    AppConfig.ChartsDataPath,
    "data_now.db",
  );

  private static getDataPath(id: string) {
    return path.join(AppConfig.ChartsDataPath, `${id}-tmp.csv`);
  }

  static get instance() {
    if (!duckdb) {
      throw new Error("DuckDB is not initialized");
    }
    return duckdb;
  }

  static async init() {
    try {
      await DuckDBService.create();
      console.log("DuckDB Initialized");
    } catch (e) {
      console.log(e);
    }
  }

  static async create() {
    if (!fs.existsSync(AppConfig.ChartsDataPath)) {
      fs.mkdirSync(AppConfig.ChartsDataPath);
    }
    duckdb = await DuckDBInstance.create(DuckDBService.dbPath);
  }

  static async connect(): Promise<DuckDBConnection> {
    if (!duckdb) {
      throw new Error("DuckDB is not initialized");
    }
    return duckdb.connect();
  }

  static async executeQuery(query: string, commit?: boolean) {
    const connection = await DuckDBService.connect();
    const queryResult = await connection.run(query);
    if (commit) {
      await connection.run("CHECKPOINT");
    }
    connection.close();
    return queryResult;
  }

  static async createTableFromCsv(tableName: string) {
    const csvPath = DuckDBService.getDataPath(tableName);

    await DuckDBService.executeQuery(
      `CREATE TABLE '${tableName}' AS FROM '${csvPath}'`,
      true,
    );
  }

  static async truncateTable(tableName: string) {
    await DuckDBService.executeQuery(`TRUNCATE '${tableName}'`, true);
  }

  static async getColumnSchema(tableName: string): Promise<ColumnConfig[]> {
    const result = await DuckDBService.executeQuery(
      `PRAGMA table_info('${tableName}');`,
    );
    const tableData = await result.getColumnsJson();
    const columns: ColumnConfig[] = [];
    for (let i = 0; i < result.rowCount; i++) {
      columns.push({
        name: tableData[1][i]?.toString() ?? "",
        type: DuckDBService.getColumnType(tableData[2][i]),
      });
    }
    return columns;
  }

  static async insertDataFromCsv(tableName: string, withHeder: boolean) {
    const csvPath = DuckDBService.getDataPath(tableName);
    await DuckDBService.executeQuery(
      `COPY '${tableName}' FROM '${csvPath}' (HEADER ${withHeder ? "TRUE" : "FALSE"})`,
      true,
    );
  }

  static async upsertDataFromCsv(tableName: string, columns: string) {
    const csvPath = DuckDBService.getDataPath(tableName);
    await DuckDBService.executeQuery(
      `COPY '${tableName}' FROM '${csvPath}'`,
      true,
    );
  }

  // #region  Helper functions

  private static getColumnType(type: Json): ColumnType {
    switch (type) {
      case DuckDBTypeId.DATE:
        return "date";
      case DuckDBTypeId.DECIMAL:
      case DuckDBTypeId.BIGINT:
      case DuckDBTypeId.DOUBLE:
      case DuckDBTypeId.INTEGER:
      case DuckDBTypeId.FLOAT:
      case DuckDBTypeId.SMALLINT:
      case DuckDBTypeId.TINYINT:
      case DuckDBTypeId.HUGEINT:
      case DuckDBTypeId.UBIGINT:
      case DuckDBTypeId.UHUGEINT:
      case DuckDBTypeId.USMALLINT:
      case DuckDBTypeId.UTINYINT:
      case DuckDBTypeId.VARINT:
        return "number";
      default:
        return "string";
    }
  }

  // #region
}
