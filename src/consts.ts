import { ToolType } from "./types";
import Fill from "./tools/Fill";
import Rectangle from "./tools/Rectangle";
import TextArt from "./tools/TextArt";
import Brush from "./tools/Brush";
import Line from "./tools/Line";
import Circle from "./tools/Circle";

export const TOOLS = {
  [ToolType.Brush]: new Brush(),
  [ToolType.Line]: new Line(),
  [ToolType.Circle]: new Circle(),
  [ToolType.Fill]: new Fill(),
  [ToolType.Rectangle]: new Rectangle(),
  [ToolType.TextArt]: new TextArt(),
};

export const PRESET_CHARS = [" ", ".", "-", "+", "*", "#", "@", "&", "%", "$"];
