import { ColorPicker, HStack, Input, parseColor, Portal, type Color } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Tool } from ".";
import { ToolType, type GridCell } from "../types";
import { PRESET_CHARS } from "../consts";

export type LineToolOption = {
  char: string;
  charColor: Color;
  backgroundColor: Color;
};

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

export default class Line extends Tool {
  type = ToolType.Line;
  isDrawingPreview = false;
  startingCell: [number, number] | null = null;
  exampleGrid: GridCell[][] = [];
  originalGrid: GridCell[][] | null = null;
  defaultToolOption: LineToolOption = {
    char: "#",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
  };
  options: LineToolOption = this.defaultToolOption;

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

  handleMouseUp(_x: number, _y: number): void {}

  handleDeselect(): void {}

  handleSelect(): void {
    this.options = this.getToolOptions()[this.type] as LineToolOption;
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
        newGrid[ny][nx] = {
          char: this.options.char,
          charColor: this.options.charColor,
          backgroundColor: this.options.backgroundColor,
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
