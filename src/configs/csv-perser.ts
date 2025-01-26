import { ParseLocalConfig } from "papaparse";

export const CsvParserConfig = {
  delimiter: ",", // auto-detect
  newline: "\n", // auto-detect
  quoteChar: '"',
  escapeChar: '"',
  header: true,
};
