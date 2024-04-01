import { Schema, model } from "mongoose";

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

export const User = model("sketch", SketchSchema);
