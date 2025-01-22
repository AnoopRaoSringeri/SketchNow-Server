"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartEnum = exports.ElementEnum = exports.CanvasActionEnum = void 0;
var CanvasActionEnum;
(function (CanvasActionEnum) {
    CanvasActionEnum["Pan"] = "pan";
    CanvasActionEnum["Zoom"] = "zoom";
    CanvasActionEnum["Select"] = "select";
    CanvasActionEnum["Resize"] = "resize";
    CanvasActionEnum["Move"] = "move";
})(CanvasActionEnum || (exports.CanvasActionEnum = CanvasActionEnum = {}));
var ElementEnum;
(function (ElementEnum) {
    ElementEnum["Line"] = "line";
    ElementEnum["Square"] = "square";
    ElementEnum["Rectangle"] = "rectangle";
    ElementEnum["Circle"] = "circle";
    ElementEnum["Pencil"] = "pencil";
    ElementEnum["Text"] = "text";
    ElementEnum["Image"] = "image";
    ElementEnum["Chart"] = "chart";
    ElementEnum["AiPrompt"] = "aiPrompt";
    ElementEnum["Move"] = "move";
    ElementEnum["Pan"] = "pan";
})(ElementEnum || (exports.ElementEnum = ElementEnum = {}));
var ChartEnum;
(function (ChartEnum) {
    ChartEnum["Table"] = "Table";
    ChartEnum["BarChart"] = "BarChart";
    ChartEnum["PieChart"] = "PieChart";
    ChartEnum["LineChart"] = "LineChart";
    ChartEnum["AreaChart"] = "AreaChart";
})(ChartEnum || (exports.ChartEnum = ChartEnum = {}));
