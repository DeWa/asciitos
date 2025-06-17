import { parseColor } from "@chakra-ui/react";
import { ToolType } from "./types";

export const DEFAULT_TOOLBAR_PROPS = {
  selectedChar: " ",
  selectedCharColor: parseColor("#ffffff"),
  selectedBgColor: parseColor("#000000"),
  selectedTool: ToolType.Brush,
};
