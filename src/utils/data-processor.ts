import {
  ColumnConfig,
  DbRowData,
  RowData,
} from "../models/helper-models/visualize";

export function GetChartData(
  records: DbRowData[],
  dimensions: ColumnConfig[],
  measures: ColumnConfig[],
): RowData[] {
  const groupedData = records.reduce(
    (acc: { [key: string]: RowData }, curr) => {
      const key = dimensions.map((d) => curr[d.name]).join("-");

      if (acc[key] == null) {
        const obj: RowData = {};
        dimensions.forEach((d) => {
          obj[d.name] = curr[d.name]?.toString() ?? null;
        });
        measures.forEach((d) => {
          obj[d.name] = curr[d.name]
            ? parseFloat(curr[d.name]!.toString())
            : null;
        });
        acc[key] = obj;
      } else {
        measures.forEach((d) => {
          acc[key][d.name] =
            Number(acc[key][d.name]) +
            (curr[d.name] ? parseFloat(curr[d.name]!.toString()) : 0);
        });
      }

      return acc;
    },
    {} as { [key: string]: RowData },
  );

  // Convert grouped object to array
  return Object.values(groupedData);
}
