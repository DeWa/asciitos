import { ColorPicker, HStack, parseColor, Portal, type Color } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Tool } from ".";
import { ToolType, type GridCell } from "../types";
import { PRESET_CHARS } from "../consts";

export type CircleToolOption = {
  char: string;
  charColor: Color;
  backgroundColor: Color;
};

const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  background-color: #333;
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px;
  width: 100%;
  max-width: 200px;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const PresetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const PresetButton = styled.button<{ $isSelected: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isSelected ? "#4a4a4a" : "#333")};
  border: 1px solid #444;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-family: monospace;
  font-size: 16px;

  &:hover {
    background-color: #4a4a4a;
  }
`;

export default class Circle extends Tool {
  type = ToolType.Circle;
  defaultToolOption: CircleToolOption = {
    char: "#",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
  };
  options: CircleToolOption = this.defaultToolOption;
  isDrawingPreview = false;
  center: [number, number] | null = null;
  originalGrid: GridCell[][] | null = null;

  handleMouseDown = (x: number, y: number): void => {
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
        this.saveHistory(newGrid);
      }
    }
  };

  handleMouseOver = (x: number, y: number): void => {
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
  };

  handleSelect = (): void => {
    this.options = this.getToolOptions()[this.type] as CircleToolOption;
  };

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
    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      grid[y][x] = {
        char: this.options.char,
        charColor: this.options.charColor,
        backgroundColor: this.options.backgroundColor,
      };
    }
  }

  handleCustomCharChange(char: string): void {
    const newOptions = { ...this.options, char };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  handlePresetCharChange(char: string): void {
    const newOptions = { ...this.options, char };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  handleCharColorChange(color: Color): void {
    const newOptions = { ...this.options, charColor: color };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  handleBgColorChange(color: Color): void {
    const newOptions = { ...this.options, backgroundColor: color };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  public getToolOptionsNode(): React.ReactNode {
    const { char, charColor, backgroundColor } = this.options;

    return (
      <>
        <Input
          type="text"
          value={char}
          onChange={(e) => this.handleCustomCharChange(e.target.value)}
          placeholder="Type a character..."
          maxLength={1}
        />
        <PresetContainer>
          {PRESET_CHARS.map((char) => (
            <PresetButton
              key={char}
              $isSelected={char === this.options.char}
              onClick={() => this.handlePresetCharChange(char)}
            >
              {char}
            </PresetButton>
          ))}
        </PresetContainer>
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
      </>
    );
  }
}
