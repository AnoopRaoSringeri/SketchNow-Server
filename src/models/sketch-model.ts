import { model, Schema } from "mongoose";
import { CanvasObject } from "./helper-models/canvas/canvas-objects";
import { CanvasMetadata } from "./helper-models/sketch/sketch-metadata";

type SketchType = {
  name: string;
  metadata: CanvasMetadata;
  createdBy: string;
  createdOn?: Date;
  dataUrl?: string;
};

type SketchUpdateRequest = {
  name: string;
  metadata: CanvasMetadata & { deletedSources: string[] };
  createdBy: string;
  createdOn?: Date;
  dataUrl?: string;
};

const SketchSchema = new Schema({
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

const Sketch = model("sketch", SketchSchema);
export { Sketch, SketchType, SketchUpdateRequest };
