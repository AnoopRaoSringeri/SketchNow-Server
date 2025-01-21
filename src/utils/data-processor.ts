import { ColumnConfig, RowData } from "../models/helper-models/visualize";

export function GetChartData(
  records: RowData[],
  dimensions: ColumnConfig[],
  measures: ColumnConfig[],
): RowData[] {
  const groupedData = records.reduce(
    (acc, curr) => {
      const key = dimensions.map((d) => curr[d.name]).join("-");

      if (!acc[key]) {
        const obj: { [key: string]: string | number } = {};
        dimensions.forEach((d) => {
          obj[d.name] = curr[d.name]?.toString();
        });
        measures.forEach((d) => {
          obj[d.name] = parseFloat(curr[d.name]?.toString());
        });
        acc[key] = obj;
      } else {
        measures.forEach((d) => {
          acc[key][d.name] =
            Number(acc[key][d.name]) + parseFloat(curr[d.name]?.toString());
        });
      }

      return acc;
    },
    {} as { [key: string]: RowData },
  );

  // Convert grouped object to array
  return Object.values(groupedData);
}
