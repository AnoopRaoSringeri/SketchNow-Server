"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = exports.GetById = exports.Get = exports.Delete = exports.Create = void 0;
const sketch_model_1 = require("@/models/sketch-model");
const Get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sketches = yield sketch_model_1.Sketch.find({});
        res.status(200).json(sketches);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.Get = Get;
const GetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sketch = yield sketch_model_1.Sketch.findById(req.params.id);
        res.status(200).json(sketch);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.GetById = GetById;
const Create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, createdBy, metadata } = req.body;
        const sketch = yield sketch_model_1.Sketch.create({
            name,
            metadata,
            createdBy,
        });
        res.status(200).json(sketch);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.Create = Create;
const Update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, createdBy, metadata } = req.body;
        yield sketch_model_1.Sketch.updateOne({ _id: id }, {
            name,
            metadata,
            createdBy,
        });
        res.status(200).json(true);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.Update = Update;
const Delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield sketch_model_1.Sketch.deleteOne({ _id: id });
        res.status(200).json(true);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.Delete = Delete;
