import type { Color } from "@chakra-ui/react";

export enum ToolType {
  Brush = "brush",
  Line = "line",
  Circle = "circle",
}

export interface ToolProps {
  setGrid: (grid: GridCell[][]) => void;
  getGrid: () => GridCell[][];
  selectedChar: string;
  toolbarProps: ToolbarProps;
}

export interface GridCell {
  char: string;
  charColor: Color;
  backgroundColor: Color;
}

export interface ToolbarProps {
  selectedChar: string;
  selectedCharColor: Color;
  selectedBgColor: Color;
  selectedTool: ToolType;
}
