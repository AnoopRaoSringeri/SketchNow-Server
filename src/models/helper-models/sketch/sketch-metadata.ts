import { CanvasObject } from "../canvas/canvas-objects";

export interface CanvasMetadata {
  elements: (CanvasObject & { id: string })[];
  size: Size;
  transform: ICanvasTransform;
}

export interface ICanvasTransform {
  scaleX: number;
  b: number;
  c: number;
  scaleY: number;
  transformX: number;
  transformY: number;
}

export interface Size {
  height: number;
  width: number;
}
