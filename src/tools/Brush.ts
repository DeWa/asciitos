import { Tool } from ".";

export default class Brush extends Tool {
  isDrawing = false;

  handleMouseDown(x: number, y: number): void {
    this.isDrawing = true;
    const newGrid = [...this.getGrid()];
    newGrid[y][x] = {
      char: this.selectedChar,
      charColor: this.toolbarProps.selectedCharColor,
      backgroundColor: this.toolbarProps.selectedBgColor,
    };
    this.setGrid(newGrid);
  }

  handleMouseOver(x: number, y: number): void {
    if (this.isDrawing) {
      const newGrid = [...this.getGrid()];
      newGrid[y][x] = {
        char: this.selectedChar,
        charColor: this.toolbarProps.selectedCharColor,
        backgroundColor: this.toolbarProps.selectedBgColor,
      };
      this.setGrid(newGrid);
    }
  }

  handleMouseUp(x: number, y: number): void {
    this.isDrawing = false;
  }

  handleDeselect(): void {
    this.isDrawing = false;
  }

  handleSelect(): void {
    console.log("Brush: handleSelect");
  }

  handleMouseUpOutside(): void {
    this.isDrawing = false;
  }
}
