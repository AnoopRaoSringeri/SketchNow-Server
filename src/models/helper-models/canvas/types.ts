import { MultiColumnSelectValue, SingleColumnSelectValue } from "./value-types";

export type ChartType = "Bar" | "Line" | "Area" | "Pie" | "Table";
export type EditorType =
  | "MultiSelect"
  | "Select"
  | "ColumnSelect"
  | "MultiColumnSelect";

export type ChartConfigMetadata = {
  measures:
    | {
        t: "s";
        v: SingleColumnSelectValue;
      }
    | {
        t: "m";
        v: MultiColumnSelectValue;
      };
  dimensions:
    | {
        t: "s";
        v: SingleColumnSelectValue;
      }
    | {
        t: "m";
        v: MultiColumnSelectValue;
      };
};
