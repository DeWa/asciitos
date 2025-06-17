import { Tool } from ".";
import type { GridCell } from "../types";

export default class Line extends Tool {
  isDrawingPreview = false;
  startingCell: [number, number] | null = null;
  exampleGrid: GridCell[][] = [];
  originalGrid: GridCell[][] | null = null;

  handleMouseDown(x: number, y: number): void {
    if (!this.isDrawingPreview) {
      this.startingCell = [x, y];
      this.isDrawingPreview = true;
      this.originalGrid = [...this.getGrid()];
    } else {
      if (this.startingCell && this.isDrawingPreview && this.originalGrid) {
        const newGrid = this.drawLine(this.originalGrid, x, y);
        this.setGrid(newGrid);

        this.originalGrid = null;
        this.isDrawingPreview = false;
        this.startingCell = null;
      }
    }
  }

  handleMouseOver(x: number, y: number): void {
    if (this.isDrawingPreview) {
      if (this.startingCell && this.originalGrid) {
        const originalGrid = [...this.originalGrid];

        // Remove last preview
        this.setGrid(originalGrid);

        // Draw new line preview
        const newGrid = this.drawLine(originalGrid, x, y);
        this.setGrid(newGrid);
      }
    }
  }

  handleMouseUp(x: number, y: number): void {}

  handleDeselect(): void {
    console.log("Line: handleDeselect");
  }

  handleSelect(): void {
    console.log("Line: handleSelect");
  }

  handleMouseUpOutside(): void {}

  drawLine(grid: GridCell[][], x: number, y: number): GridCell[][] {
    if (this.startingCell) {
      const [x0, y0] = this.startingCell;
      const [x1, y1] = [x, y];

      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      const newGrid = grid.map((row) => [...row]);
      let nx = x0;
      let ny = y0;

      while (true) {
        newGrid[nx][ny] = {
          char: this.selectedChar,
          charColor: this.toolbarProps.selectedCharColor,
          backgroundColor: this.toolbarProps.selectedBgColor,
        };
        if (nx === x1 && ny === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          nx += sx;
        }
        if (e2 < dx) {
          err += dx;
          ny += sy;
        }
      }
      return newGrid;
    }
    return grid;
  }
}
