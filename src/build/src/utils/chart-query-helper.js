"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHelper = void 0;
const visualize_1 = require("../models/helper-models/visualize");
class QueryHelper {
    static getMeasureQuery(measure) {
        return `${QueryHelper.getMeasureAggregatorFun(measure.fun)}("${measure.name}") as "${measure.name}"`;
    }
    static getMeasureAggregatorFun(fun) {
        switch (fun) {
            case visualize_1.MeasureAggregateFun.Average:
                return "AVG";
            case visualize_1.MeasureAggregateFun.Sum:
                return "SUM";
            case visualize_1.MeasureAggregateFun.Max:
                return "MAX";
            case visualize_1.MeasureAggregateFun.Min:
                return "MIN";
            case visualize_1.MeasureAggregateFun.Count:
                return "COUNT";
            default:
                return "SUM";
        }
    }
}
exports.QueryHelper = QueryHelper;
