import { Tool } from ".";
import type { GridCell } from "../types";
import type { Color } from "@chakra-ui/react";

export default class Fill extends Tool {
  handleMouseDown(x: number, y: number): void {
    const grid = this.getGrid();
    const targetChar = grid[y][x].char;
    const targetCharColor = grid[y][x].charColor;
    const targetBgColor = grid[y][x].backgroundColor;

    const { selectedChar, selectedCharColor, selectedBgColor } = this.toolbarProps;
    // If the target cell already has the same properties, no need to fill
    if (
      targetChar === selectedChar &&
      targetCharColor === selectedCharColor &&
      targetBgColor === selectedBgColor
    ) {
      return;
    }

    const newGrid = this.floodFill(grid, x, y, targetChar, targetCharColor, targetBgColor);
    this.setGrid(newGrid);
  }

  handleMouseOver(): void {}

  handleMouseUp(): void {}

  handleDeselect(): void {}

  handleSelect(): void {}

  handleMouseUpOutside(): void {}

  private floodFill(
    grid: GridCell[][],
    x: number,
    y: number,
    targetChar: string,
    targetCharColor: Color,
    targetBgColor: Color
  ): GridCell[][] {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    const visited = new Set<string>();
    const queue: [number, number][] = [[x, y]];

    const isSame = (cell: GridCell) =>
      cell.char === targetChar &&
      cell.charColor.toString("hex") === targetCharColor.toString("hex") &&
      cell.backgroundColor.toString("hex") === targetBgColor.toString("hex");

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;

      // Bounds check
      if (x < 0 || x >= newGrid[0].length || y < 0 || y >= newGrid.length) continue;

      const key = `${x},${y}`;
      if (visited.has(key)) continue;
      visited.add(key);

      const cell = newGrid[y][x];
      if (!isSame(cell)) continue;

      // Fill cell
      newGrid[y][x] = {
        char: this.toolbarProps.selectedChar,
        charColor: this.toolbarProps.selectedCharColor,
        backgroundColor: this.toolbarProps.selectedBgColor,
      };

      // Add 4-directional neighbors
      queue.push([x + 1, y]); // right
      queue.push([x - 1, y]); // left
      queue.push([x, y + 1]); // down
      queue.push([x, y - 1]); // up
    }

    return newGrid;
  }
}
