"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureAggregateFun = void 0;
var MeasureAggregateFun;
(function (MeasureAggregateFun) {
    MeasureAggregateFun[MeasureAggregateFun["Sum"] = 0] = "Sum";
    MeasureAggregateFun[MeasureAggregateFun["Average"] = 1] = "Average";
    MeasureAggregateFun[MeasureAggregateFun["Max"] = 2] = "Max";
    MeasureAggregateFun[MeasureAggregateFun["Min"] = 3] = "Min";
    MeasureAggregateFun[MeasureAggregateFun["Count"] = 4] = "Count";
})(MeasureAggregateFun || (exports.MeasureAggregateFun = MeasureAggregateFun = {}));
