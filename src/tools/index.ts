import { DEFAULT_TOOLBAR_PROPS } from "../consts";
import { type ToolbarProps, type ToolProps, type GridCell } from "../types";

export abstract class Tool {
  setGrid: (grid: GridCell[][]) => void = () => {};
  getGrid: () => GridCell[][] = () => [];
  selectedChar: string = " ";
  toolbarProps: ToolbarProps = DEFAULT_TOOLBAR_PROPS;

  abstract handleMouseDown(x: number, y: number): void;
  abstract handleMouseOver(x: number, y: number): void;
  abstract handleMouseUp(x: number, y: number): void;
  abstract handleDeselect(): void;
  abstract handleSelect(): void;
  abstract handleMouseUpOutside(): void;
  updateProps(props: ToolProps): void {
    this.setGrid = props.setGrid;
    this.getGrid = props.getGrid;
    this.selectedChar = props.selectedChar;
    this.toolbarProps = props.toolbarProps;
  }
}
