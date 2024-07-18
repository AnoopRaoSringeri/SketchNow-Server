"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = exports.GetById = exports.Get = exports.Delete = exports.Create = void 0;
const session_1 = __importDefault(require("../middlewares/session"));
const sketch_model_1 = require("../models/sketch-model");
const Get = async (req, res) => {
    try {
        const session = await (0, session_1.default)(req);
        if (session) {
            const { _id } = session;
            const sketches = await sketch_model_1.Sketch.find({ createdBy: _id });
            res.status(200).json(sketches);
        }
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
exports.Get = Get;
const GetById = async (req, res) => {
    try {
        const sketch = await sketch_model_1.Sketch.findById(req.params.id);
        res.status(200).json(sketch);
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
exports.GetById = GetById;
const Create = async (req, res) => {
    try {
        const { name, metadata } = req.body;
        const session = await (0, session_1.default)(req);
        if (session) {
            const { _id } = session;
            const sketch = await sketch_model_1.Sketch.create({
                name,
                metadata,
                createdBy: _id,
            });
            res.status(200).json(sketch);
        }
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
exports.Create = Create;
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, metadata } = req.body;
        await sketch_model_1.Sketch.updateOne({ _id: id }, {
            name,
            metadata,
        });
        res.status(200).json(true);
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
exports.Update = Update;
const Delete = async (req, res) => {
    try {
        const { id } = req.params;
        await sketch_model_1.Sketch.deleteOne({ _id: id });
        res.status(200).json(true);
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
exports.Delete = Delete;
