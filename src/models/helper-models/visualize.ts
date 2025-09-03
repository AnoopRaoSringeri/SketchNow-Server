import { Json } from "@duckdb/node-api";

export type ColumnType = "string" | "number" | "date";

export type ColumnConfig = {
  name: string;
  type: ColumnType;
};

export enum MeasureAggregateFun {
  Sum = "Sum",
  Average = "Average",
  Max = "Max",
  Min = "Min",
  Count = "Count",
}

export type MeasureConfig = {
  fun: MeasureAggregateFun;
} & ColumnConfig;

export type SortConfig = {
  column: string;
  sort: "ASC" | "DESC";
};

export type RowData = Record<string, string | number | null>;

export type DbRowData = Record<string, Json>;

export type ChartDataRequest = {
  id: string;
  measures: MeasureConfig[];
  dimensions: ColumnConfig[];
  columns: ColumnConfig[];
  sort: SortConfig[];
};

export type ChartDataUpdateRequest = {
  id: string;
  mode: "truncate" | "insert" | "update";
};
