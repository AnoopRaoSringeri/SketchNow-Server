"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = exports.GetImageData = exports.GetById = exports.Get = exports.Delete = exports.Create = void 0;
const fs_1 = __importDefault(require("fs"));
const configs_1 = require("../configs");
const session_1 = __importDefault(require("../middlewares/session"));
const sketch_model_1 = require("../models/sketch-model");
const redis_1 = require("../services/redis");
const try_catch_1 = require("../utils/try-catch");
const Get = (0, try_catch_1.tryCatch)(async (req, res) => {
    const session = await (0, session_1.default)(req);
    if (session) {
        const { _id } = session;
        const dbSketches = await sketch_model_1.Sketch.find({ createdBy: _id }).select([
            "_id",
            "name",
            "createdBy",
            "createdOn",
        ]);
        res.status(200).json(dbSketches);
    }
});
exports.Get = Get;
const GetById = (0, try_catch_1.tryCatch)(async (req, res) => {
    const session = await (0, session_1.default)(req);
    if (session) {
        const sketch = await sketch_model_1.Sketch.findById(req.params.id);
        res.status(200).json(sketch);
    }
});
exports.GetById = GetById;
const GetImageData = (0, try_catch_1.tryCatch)(async (req, res) => {
    const session = await (0, session_1.default)(req);
    if (session) {
        const dataUrl = await redis_1.RedisClient.get(req.params.id.toString());
        res.status(200).json(dataUrl);
    }
});
exports.GetImageData = GetImageData;
const Create = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { name, metadata, dataUrl } = req.body;
    const session = await (0, session_1.default)(req);
    if (session) {
        const { _id } = session;
        const sketch = await sketch_model_1.Sketch.create({
            name,
            metadata,
            createdBy: _id,
        });
        await redis_1.RedisClient.set(sketch._id.toString(), dataUrl !== null && dataUrl !== void 0 ? dataUrl : "");
        res.status(200).json(sketch);
    }
});
exports.Create = Create;
const Update = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { id } = req.params;
    const { name, metadata, dataUrl } = req.body;
    await sketch_model_1.Sketch.updateOne({ _id: id }, {
        name,
        metadata,
    });
    await redis_1.RedisClient.set(id, dataUrl !== null && dataUrl !== void 0 ? dataUrl : "");
    metadata.deletedSources.forEach((deletedSource) => {
        fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${deletedSource}.csv`, () => {
            //
        });
    });
    res.status(200).json(true);
});
exports.Update = Update;
const Delete = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { id } = req.params;
    const sketch = await sketch_model_1.Sketch.findById(req.params.id);
    sketch === null || sketch === void 0 ? void 0 : sketch.metadata.elements.forEach((data) => {
        if (data.type == "chart") {
            const { metadata: chartMetadata } = data.value;
            if (chartMetadata.source.type == "File") {
                fs_1.default.unlink(`${configs_1.AppConfig.ChartsDataPath}/${chartMetadata.source.id}.csv`, () => {
                    //
                });
            }
        }
    });
    await sketch_model_1.Sketch.deleteOne({ _id: id });
    res.status(200).json(true);
});
exports.Delete = Delete;
