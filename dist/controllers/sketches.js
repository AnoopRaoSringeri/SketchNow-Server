"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = exports.GetById = exports.Get = exports.Delete = exports.Create = void 0;
const sketch_model_1 = require("../models/sketch-model");
const Get = async (req, res) => {
    try {
        const sketches = await sketch_model_1.Sketch.find({});
        res.status(200).json(sketches);
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
        const { name, createdBy, metadata } = req.body;
        const sketch = await sketch_model_1.Sketch.create({
            name,
            metadata,
            createdBy,
        });
        res.status(200).json(sketch);
    }
    catch (error) {
        res.status(400).json({ error });
    }
};
exports.Create = Create;
const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, createdBy, metadata } = req.body;
        await sketch_model_1.Sketch.updateOne({ _id: id }, {
            name,
            metadata,
            createdBy,
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
