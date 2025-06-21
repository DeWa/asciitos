import { type GridCell, ToolType, type ToolOption } from "../types";

export abstract class Tool {
  abstract type: ToolType;
  abstract options: ToolOption;
  setGrid: (grid: GridCell[][]) => void = () => {};
  getGrid: () => GridCell[][] = () => [];
  setToolOptions: (options: Record<ToolType, ToolOption>) => void = () => {};
  getToolOptions: () => Record<ToolType, ToolOption> = () => ({}) as Record<ToolType, ToolOption>;
  selectedChar: string = " ";

  abstract handleMouseDown(x: number, y: number): void;
  abstract handleMouseOver(x: number, y: number): void;
  abstract handleMouseUp(x: number, y: number): void;
  abstract handleDeselect(): void;
  abstract handleSelect(): void;
  abstract handleMouseUpOutside(): void;
  updateProps(props: {
    setGrid: (grid: GridCell[][]) => void;
    getGrid: () => GridCell[][];
    setToolOptions: (options: Record<ToolType, ToolOption>) => void;
    getToolOptions: () => Record<ToolType, ToolOption>;
  }): void {
    this.setGrid = props.setGrid;
    this.getGrid = props.getGrid;
    this.setToolOptions = props.setToolOptions;
    this.getToolOptions = props.getToolOptions;
    this.options = props.getToolOptions()[this.type];
  }

  abstract getToolOptionsNode(): React.ReactNode;
}
