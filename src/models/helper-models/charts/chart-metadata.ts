import { ChartConfigMetadata, ChartType } from "../canvas/types";
import { ChartSource } from "../canvas/source";
import { ValueType } from "../canvas/value-types";
import { ColumnConfig } from "../visualize";

export type ChartMetadata = {
  type: ChartType;
  source: ChartSource;
  options: Record<string, ValueType>;
  config: ChartConfigMetadata;
  columnConfig: ColumnConfig[];
};
