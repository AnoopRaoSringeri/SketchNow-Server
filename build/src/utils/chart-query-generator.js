"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryGenerator = void 0;
const chart_query_helper_1 = require("./chart-query-helper");
const ROWS_PER_PAGE = 100;
class QueryGenerator {
    constructor(request, page) {
        this.request = request;
        this.page = null;
        this.page = page !== null && page !== void 0 ? page : null;
    }
    get Page() {
        return this.page;
    }
    set Page(page) {
        this.page = page;
    }
    generate() {
        return `SELECT *, ROW_NUMBER() OVER () AS rowid FROM (${this.constructBaseQuery()} ${this.constructLimitQuery()})`;
    }
    generateCountQuery() {
        return `SELECT COUNT(*) FROM (${this.constructBaseQuery()})`;
    }
    constructBaseQuery() {
        let query = "";
        const { id } = this.request;
        const measureQuery = this.constructMeasureQuery();
        const dimensionQuery = this.constructDimensionQuery();
        const orderByQuery = this.constructOrderByQuery();
        const groupByQuery = this.constructGroupByQuery();
        query = `SELECT ${dimensionQuery}, ${measureQuery}  FROM '${id}' ${groupByQuery} ${orderByQuery}`;
        return query;
    }
    constructMeasureQuery() {
        return this.request.measures
            .map((m) => chart_query_helper_1.QueryHelper.getMeasureQuery(m))
            .join(", ");
    }
    constructDimensionQuery() {
        return this.request.dimensions.map((d) => `"${d.name}"`).join(", ");
    }
    constructGroupByQuery() {
        return this.request.dimensions.length == 0
            ? ""
            : `GROUP BY ${this.request.dimensions.map((d) => `"${d.name}"`).join(", ")}`;
    }
    constructOrderByQuery() {
        const queries = [];
        this.request.sort.forEach((s) => {
            const measure = this.request.measures.find((m) => m.name === s.column);
            if (measure) {
                queries.push(`${chart_query_helper_1.QueryHelper.getMeasureQuery(measure)} ${s.sort}`);
            }
            else {
                queries.push(`"${s.column}" ${s.sort}`);
            }
        });
        return queries.length == 0 ? "" : `ORDER BY ${queries.join(", ")}`;
    }
    constructLimitQuery() {
        return `${this.page ? `LIMIT ${this.page * ROWS_PER_PAGE} ` : ""}`;
    }
}
exports.QueryGenerator = QueryGenerator;
