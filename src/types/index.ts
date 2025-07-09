import type { BrushToolOption } from "../tools/Brush";
import type { CircleToolOption } from "../tools/Circle";
import type { FillToolOption } from "../tools/Fill";
import type { LineToolOption } from "../tools/Line";
import type { RectangleToolOption } from "../tools/Rectangle";
import type { TextToolOption } from "../tools/Text";
import type { TextArtToolOption } from "../tools/TextArt";

export enum ToolType {
  Brush = "brush",
  Line = "line",
  Circle = "circle",
  Fill = "fill",
  Rectangle = "rectangle",
  TextArt = "text-art",
  Text = "text",
}

export type ToolOption =
  | BrushToolOption
  | CircleToolOption
  | LineToolOption
  | FillToolOption
  | RectangleToolOption
  | TextArtToolOption
  | TextToolOption;

export interface GridCell {
  char: string;
  charColor: Color;
  backgroundColor: Color;
  isBlinking?: boolean;
}

export interface EditorOptions {
  showGrid: boolean;
}
