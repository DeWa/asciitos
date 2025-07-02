import { ColorPicker, HStack, parseColor, Portal, type Color } from "@chakra-ui/react";
import { Tool } from ".";
import { ToolType, type GridCell } from "../types";

export type TextToolOption = {
  text: string;
  charColor: Color;
  backgroundColor: Color;
};

export default class Text extends Tool {
  type = ToolType.Text;
  isTyping = false;
  originalGrid: GridCell[][] | null = null;
  startingPosition: [number, number] | null = null;
  pointerPosition: [number, number] = [0, 0];
  defaultToolOption: TextToolOption = {
    text: "",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
  };
  options: TextToolOption = this.defaultToolOption;

  private updatePointer(grid: GridCell[][]) {
    const x = this.pointerPosition[0];
    const y = this.pointerPosition[1];

    if (x >= grid[0].length) {
      return grid;
    }

    grid[y][x] = {
      char: "│",
      charColor: parseColor("#ffffff"),
      backgroundColor: this.options.backgroundColor,
      isBlinking: true,
    };
    return grid;
  }

  private setCharacter(grid: GridCell[][], x: number, y: number, char: string): GridCell[][] {
    grid[y][x] = {
      char,
      charColor: this.options.charColor,
      backgroundColor: this.options.backgroundColor,
      isBlinking: false,
    };
    return grid;
  }

  override handleMouseDown = (x: number, y: number) => {
    if (!this.isTyping) {
      this.isTyping = true;
      this.pointerPosition = [x, y];
      this.startingPosition = [x, y];
      this.originalGrid = this.getGrid().map((row) => row.map((cell) => ({ ...cell })));
      const newGrid = this.originalGrid.map((row) => row.map((cell) => ({ ...cell })));
      this.updatePointer(newGrid);
      this.setGrid(newGrid);
    } else {
      this.stopTyping();
    }
  };

  override handleDeselect = (): void => {
    if (this.originalGrid && this.isTyping) {
      this.setGrid(this.originalGrid);
    }
    this.isTyping = false;
    this.startingPosition = null;
    this.originalGrid = null;
  };

  override handleKeyDown = (event: KeyboardEvent) => {
    if (this.isTyping) {
      // Handle text input
      if (event.key.length === 1 && this.pointerPosition) {
        const grid = this.getGrid();
        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

        // Skip if the pointer is at the end of the row
        if (this.pointerPosition[0] + 1 > grid[0].length) {
          return;
        }
        this.setCharacter(newGrid, this.pointerPosition[0], this.pointerPosition[1], event.key);
        this.pointerPosition[0]++;
        this.updatePointer(newGrid);
        this.setGrid(newGrid);
        // Handle deletion (backspace)
      } else if (
        event.key === "Backspace" &&
        this.pointerPosition &&
        this.originalGrid &&
        this.startingPosition
      ) {
        const grid = this.getGrid();
        const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

        this.restoreCell(newGrid, this.pointerPosition[0], this.pointerPosition[1]);
        this.restoreCell(newGrid, this.pointerPosition[0] + 1, this.pointerPosition[1]); // Pointer

        this.pointerPosition[0]--;
        if (this.pointerPosition[0] < this.startingPosition[0]) {
          this.pointerPosition[0] = this.startingPosition[0];
          return;
        }
        this.updatePointer(newGrid);
        this.setGrid(newGrid);
        // Handle text end (enter)
      } else if (event.key === "Enter") {
        this.stopTyping();
      }
    }
  };

  private stopTyping() {
    this.isTyping = false;
    this.startingPosition = null;
    const grid = this.getGrid();
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    this.restoreCell(newGrid, this.pointerPosition[0], this.pointerPosition[1]); // Pointer
    this.setGrid(newGrid);
    this.saveHistory(newGrid);
  }

  override handleSelect = (): void => {
    this.originalGrid = this.getGrid();
    this.options = this.getToolOptions()[this.type] as TextToolOption;
  };

  handleCharColorChange = (color: Color) => {
    const newOptions = { ...this.options, charColor: color };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  };

  handleBgColorChange = (color: Color) => {
    const newOptions = { ...this.options, backgroundColor: color };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  };

  private restoreCell(grid: GridCell[][], x: number, y: number) {
    if (this.originalGrid && this.originalGrid[y][x]) {
      grid[y][x] = {
        char: this.originalGrid[y][x].char,
        charColor: this.originalGrid[y][x].charColor,
        backgroundColor: this.originalGrid[y][x].backgroundColor,
        isBlinking: this.originalGrid[y][x].isBlinking,
      };
    }
  }

  public getToolOptionsNode(): React.ReactNode {
    const { charColor, backgroundColor } = this.options;

    return (
      <HStack>
        {/* Set character color */}
        <ColorPicker.Root
          defaultValue={charColor}
          size="md"
          onValueChangeEnd={(value) => this.handleCharColorChange(value.value)}
        >
          <ColorPicker.HiddenInput />
          <ColorPicker.Label>Character Color</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="xs" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
        {/* Set background color */}
        <ColorPicker.Root
          defaultValue={backgroundColor}
          size="md"
          onValueChangeEnd={(value) => this.handleBgColorChange(value.value)}
        >
          <ColorPicker.HiddenInput />
          <ColorPicker.Label>Background Color</ColorPicker.Label>
          <ColorPicker.Control>
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="xs" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
      </HStack>
    );
  }
}
