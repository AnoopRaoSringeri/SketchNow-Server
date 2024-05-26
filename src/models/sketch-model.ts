import { model, Schema } from "mongoose";

type SketchType = {
  name: string;
  metadata: object;
  createdBy: string;
  createdOn?: Date;
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
