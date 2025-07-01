import { ColorPicker, HStack, Input, parseColor, Portal, type Color } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Tool } from ".";
import { ToolType, type GridCell } from "../types";
import { PRESET_CHARS } from "../consts";

export type FillToolOption = {
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

export default class Fill extends Tool {
  type = ToolType.Fill;
  defaultToolOption: FillToolOption = {
    char: "#",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
  };
  options: FillToolOption = this.defaultToolOption;

  handleMouseDown = (x: number, y: number): void => {
    const grid = this.getGrid();
    const targetChar = grid[y][x].char;
    const targetCharColor = grid[y][x].charColor;
    const targetBgColor = grid[y][x].backgroundColor;

    const { char, charColor, backgroundColor } = this.options;
    // If the target cell already has the same properties, no need to fill
    if (targetChar === char && targetCharColor === charColor && targetBgColor === backgroundColor) {
      return;
    }

    const newGrid = this.floodFill(grid, x, y, targetChar, targetCharColor, targetBgColor);
    this.setGrid(newGrid);
    this.saveHistory(newGrid);
  };

  handleSelect = (): void => {
    this.options = this.getToolOptions()[this.type] as FillToolOption;
  };

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
        char: this.options.char,
        charColor: this.options.charColor,
        backgroundColor: this.options.backgroundColor,
      };

      // Add 4-directional neighbors
      queue.push([x + 1, y]); // right
      queue.push([x - 1, y]); // left
      queue.push([x, y + 1]); // down
      queue.push([x, y - 1]); // up
    }

    return newGrid;
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
