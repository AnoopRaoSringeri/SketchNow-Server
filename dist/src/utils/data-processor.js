"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChartData = void 0;
function GetChartData(records, dimensions, measures) {
    const groupedData = records.reduce((acc, curr) => {
        const key = dimensions.map((d) => curr[d.name]).join("-");
        if (!acc[key]) {
            const obj = {};
            dimensions.forEach((d) => {
                var _a;
                obj[d.name] = (_a = curr[d.name]) === null || _a === void 0 ? void 0 : _a.toString();
            });
            measures.forEach((d) => {
                var _a;
                obj[d.name] = parseFloat((_a = curr[d.name]) === null || _a === void 0 ? void 0 : _a.toString());
            });
            acc[key] = obj;
        }
        else {
            measures.forEach((d) => {
                var _a;
                acc[key][d.name] =
                    Number(acc[key][d.name]) + parseFloat((_a = curr[d.name]) === null || _a === void 0 ? void 0 : _a.toString());
            });
        }
        return acc;
    }, {});
    // Convert grouped object to array
    return Object.values(groupedData);
}
exports.GetChartData = GetChartData;
