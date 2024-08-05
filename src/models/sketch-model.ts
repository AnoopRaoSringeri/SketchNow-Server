import { model, Schema } from "mongoose";

export interface ElementMetadata {
  x: number;
  y: number;
  h: number;
  w: number;
  r: number;
  sa: number;
  ea: number;
  points: [number, number][];
}

export interface CanvasMetadata {
  elements: ElementMetadata[];
  tables: ElementMetadata[];
  height: number;
  width: number;
}

type SketchType = {
  name: string;
  metadata: ElementMetadata[];
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
export { Sketch, SketchType };
