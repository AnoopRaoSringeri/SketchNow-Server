import { Json } from "@duckdb/node-api";

export type ColumnType = "string" | "number" | "date";

export type ColumnConfig = {
  name: string;
  type: ColumnType;
};

export type RowData = Record<string, string | number | null>;

export type DbRowData = Record<string, Json>;

export type ChartDataRequest = {
  id: string;
  measures: ColumnConfig[];
  dimensions: ColumnConfig[];
  columns: ColumnConfig[];
};

export type ChartDataUpdateRequest = {
  id: string;
  mode: "truncate" | "insert" | "update";
};
