import { ChartDataRequest } from "../models/helper-models/visualize";
import { QueryHelper } from "./chart-query-helper";

const ROWS_PER_PAGE = 100;

export class QueryGenerator {
  private page: number | null = null;

  constructor(
    private request: ChartDataRequest,
    page?: number,
  ) {
    this.page = page ?? null;
  }

  get Page() {
    return this.page;
  }

  set Page(page: number | null) {
    this.page = page;
  }

  generate() {
    return `SELECT *, ROW_NUMBER() OVER () AS rowid FROM (${this.constructBaseQuery()} ${this.constructLimitQuery()})`;
  }

  generateCountQuery() {
    return `SELECT COUNT(*) FROM (${this.constructBaseQuery()})`;
  }

  private constructBaseQuery() {
    let query = "";
    const { id } = this.request;
    const measureQuery = this.constructMeasureQuery();
    const dimensionQuery = this.constructDimensionQuery();
    const orderByQuery = this.constructOrderByQuery();
    const groupByQuery = this.constructGroupByQuery();
    query = `SELECT ${dimensionQuery}, ${measureQuery}  FROM '${id}' ${groupByQuery} ${orderByQuery}`;
    return query;
  }

  private constructMeasureQuery() {
    return this.request.measures
      .map((m) => QueryHelper.getMeasureQuery(m))
      .join(", ");
  }

  private constructDimensionQuery() {
    return this.request.dimensions.map((d) => `"${d.name}"`).join(", ");
  }

  private constructGroupByQuery() {
    return this.request.dimensions.length == 0
      ? ""
      : `GROUP BY ${this.request.dimensions.map((d) => `"${d.name}"`).join(", ")}`;
  }

  private constructOrderByQuery() {
    const queries: string[] = [];
    this.request.sort.forEach((s) => {
      const measure = this.request.measures.find((m) => m.name === s.column);
      if (measure) {
        queries.push(`${QueryHelper.getMeasureQuery(measure)} ${s.sort}`);
      } else {
        queries.push(`"${s.column}" ${s.sort}`);
      }
    });
    return queries.length == 0 ? "" : `ORDER BY ${queries.join(", ")}`;
  }

  private constructLimitQuery() {
    return `${this.page ? `LIMIT ${this.page * ROWS_PER_PAGE} ` : ""}`;
  }
}
