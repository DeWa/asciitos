import { type GridCell, ToolType, type ToolOption } from "../types";

export abstract class Tool {
  abstract type: ToolType;
  abstract options: ToolOption;
  setGrid: (grid: GridCell[][]) => void = () => {};
  getGrid: () => GridCell[][] = () => [];
  setToolOptions: (options: Record<ToolType, ToolOption>) => void = () => {};
  getToolOptions: () => Record<ToolType, ToolOption> = () => ({}) as Record<ToolType, ToolOption>;
  selectedChar: string = " ";

  handleMouseDown = (_x: number, _y: number): void => {
    //pass
  };
  handleMouseOver = (_x: number, _y: number): void => {
    //pass
  };
  handleMouseUp = (_x: number, _y: number): void => {
    //pass
  };
  handleDeselect = (): void => {
    //pass
  };
  handleSelect = (): void => {
    //pass
  };
  handleMouseUpOutside = (): void => {
    //pass
  };
  handleKeyDown = (_event: KeyboardEvent): void => {
    //pass
  };

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
