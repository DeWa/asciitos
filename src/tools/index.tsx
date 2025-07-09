import { type GridCell, type ToolOption, ToolType } from "../types";

export abstract class Tool {
  abstract type: ToolType;
  abstract options: ToolOption;
  setGrid: (grid: GridCell[][]) => void = () => {};
  getGrid: () => GridCell[][] = () => [];
  getActionHistory: () => { history: GridCell[][][]; index: number } = () => ({
    history: [],
    index: 0,
  });
  setActionHistory: (actionHistory: { history: GridCell[][][]; index: number }) => void = () => {};
  setToolOptions: (options: Record<ToolType, ToolOption>) => void = () => {};
  getToolOptions: () => Record<ToolType, ToolOption> = () => ({}) as Record<ToolType, ToolOption>;

  public handleMouseDown = (_x: number, _y: number): void => {};
  public handleMouseOver = (_x: number, _y: number): void => {};
  public handleMouseUp = (_x: number, _y: number): void => {};
  public handleDeselect = (): void => {};
  public handleSelect = (): void => {};
  public handleMouseUpOutside = (): void => {};
  public handleKeyDown = (_event: KeyboardEvent): void => {};
  public handleUndo = (_grid: GridCell[][]): void => {};
  public handleRedo = (_grid: GridCell[][]): void => {};

  protected saveHistory(grid: GridCell[][]): void {
    const currentHistory = this.getActionHistory();
    // If we're not at the end of history, truncate it
    const newHistory = currentHistory.history.slice(0, currentHistory.index + 1);

    // Add the new grid state
    newHistory.push(grid);
    // Remove the oldest history if we have more than 20
    if (newHistory.length > 20) {
      newHistory.shift();
    }

    let newIndex = currentHistory.index;
    if (currentHistory.index !== 20) {
      newIndex = currentHistory.index + 1;
    }

    // Remove redo history
    if (newIndex > newHistory.length) {
      newHistory.slice(0, newIndex);
    }

    this.setActionHistory({
      history: newHistory,
      index: newIndex,
    });
  }

  updateProps(props: {
    setGrid: (grid: GridCell[][]) => void;
    getGrid: () => GridCell[][];
    setActionHistory: (grid: { history: GridCell[][][]; index: number }) => void;
    getActionHistory: () => { history: GridCell[][][]; index: number };
    setToolOptions: (options: Record<ToolType, ToolOption>) => void;
    getToolOptions: () => Record<ToolType, ToolOption>;
  }): void {
    this.setGrid = props.setGrid;
    this.getGrid = props.getGrid;
    this.getActionHistory = props.getActionHistory;
    this.setActionHistory = props.setActionHistory;
    this.setToolOptions = props.setToolOptions;
    this.getToolOptions = props.getToolOptions;
    this.options = props.getToolOptions()[this.type];
  }

  abstract getToolOptionsNode(): React.ReactNode;
}
