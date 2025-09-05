"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetChartData = void 0;
function GetChartData(records, dimensions, measures) {
    const groupedData = records.reduce((acc, curr) => {
        const key = dimensions.map((d) => curr[d.name]).join("-");
        if (acc[key] == null) {
            const obj = {};
            dimensions.forEach((d) => {
                var _a, _b;
                obj[d.name] = (_b = (_a = curr[d.name]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null;
            });
            measures.forEach((d) => {
                obj[d.name] = curr[d.name]
                    ? parseFloat(curr[d.name].toString())
                    : null;
            });
            acc[key] = obj;
        }
        else {
            measures.forEach((d) => {
                acc[key][d.name] =
                    Number(acc[key][d.name]) +
                        (curr[d.name] ? parseFloat(curr[d.name].toString()) : 0);
            });
        }
        return acc;
    }, {});
    // Convert grouped object to array
    return Object.values(groupedData);
}
exports.GetChartData = GetChartData;
