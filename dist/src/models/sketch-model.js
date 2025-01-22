"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sketch = void 0;
const mongoose_1 = require("mongoose");
const SketchSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    metadata: {
        type: Object,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now(),
    },
});
const Sketch = (0, mongoose_1.model)("sketch", SketchSchema);
exports.Sketch = Sketch;
