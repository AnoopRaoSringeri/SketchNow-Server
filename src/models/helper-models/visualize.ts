export type ColumnConfig = { name: string; type: string };

export type RowData = Record<string, string | number>;

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
