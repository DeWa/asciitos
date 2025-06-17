import { Tool } from ".";
import type { GridCell } from "../types";

export default class Circle extends Tool {
  isDrawingPreview = false;
  center: [number, number] | null = null;
  originalGrid: GridCell[][] | null = null;

  handleMouseDown(x: number, y: number): void {
    if (!this.isDrawingPreview) {
      this.center = [x, y];
      this.isDrawingPreview = true;
      this.originalGrid = [...this.getGrid()];
    } else {
      if (this.center && this.isDrawingPreview && this.originalGrid) {
        const newGrid = this.drawCircle(this.originalGrid, x, y);
        this.setGrid(newGrid);

        this.originalGrid = null;
        this.isDrawingPreview = false;
        this.center = null;
      }
    }
  }

  handleMouseOver(x: number, y: number): void {
    if (this.isDrawingPreview) {
      if (this.center && this.originalGrid) {
        const originalGrid = this.originalGrid.map((row) => [...row]);

        // Remove last preview
        this.setGrid(originalGrid);

        // Draw new circle preview
        const newGrid = this.drawCircle(originalGrid, x, y);
        this.setGrid(newGrid);
      }
    }
  }

  handleMouseUp(): void {}

  handleDeselect(): void {
    console.log("Circle: handleDeselect");
  }

  handleSelect(): void {
    console.log("Circle: handleSelect");
  }

  handleMouseUpOutside(): void {}

  drawCircle(grid: GridCell[][], x: number, y: number): GridCell[][] {
    if (!this.center) return grid;

    const [centerX, centerY] = this.center;
    const radius = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    const newGrid = [...grid];
    let x1 = Math.round(radius);
    let y1 = 0;
    let err = 0;

    while (x1 >= y1) {
      // Draw points in all octants
      this.setPixel(newGrid, centerX + x1, centerY + y1);
      this.setPixel(newGrid, centerX + y1, centerY + x1);
      this.setPixel(newGrid, centerX - y1, centerY + x1);
      this.setPixel(newGrid, centerX - x1, centerY + y1);
      this.setPixel(newGrid, centerX - x1, centerY - y1);
      this.setPixel(newGrid, centerX - y1, centerY - x1);
      this.setPixel(newGrid, centerX + y1, centerY - x1);
      this.setPixel(newGrid, centerX + x1, centerY - y1);

      if (err <= 0) {
        y1 += 1;
        err += 2 * y1 + 1;
      }
      if (err > 0) {
        x1 -= 1;
        err -= 2 * x1 + 1;
      }
    }
    return newGrid;
  }

  private setPixel(grid: GridCell[][], x: number, y: number): void {
    // Check if the coordinates are within the grid bounds
    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
      grid[x][y] = {
        char: this.toolbarProps.selectedChar,
        charColor: this.toolbarProps.selectedCharColor,
        backgroundColor: this.toolbarProps.selectedBgColor,
      };
    }
  }
}
