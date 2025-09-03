import {
  MeasureAggregateFun,
  MeasureConfig,
} from "../models/helper-models/visualize";

export class QueryHelper {
  static getMeasureQuery(measure: MeasureConfig) {
    return `CAST(${QueryHelper.getMeasureAggregatorFun(measure.fun)}("${measure.name}") AS INTEGER) as "${measure.name}"`;
  }

  static getMeasureAggregatorFun(fun: MeasureAggregateFun) {
    switch (fun) {
      case MeasureAggregateFun.Average:
        return "AVG";
      case MeasureAggregateFun.Sum:
        return "SUM";
      case MeasureAggregateFun.Max:
        return "MAX";
      case MeasureAggregateFun.Min:
        return "MIN";
      case MeasureAggregateFun.Count:
        return "COUNT";
      default:
        return "SUM";
    }
  }
}
