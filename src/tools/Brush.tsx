import { ColorPicker, HStack, Input, parseColor, Portal, type Color } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Tool } from ".";
import { ToolType } from "../types";
import { PRESET_CHARS } from "../consts";

export type BrushToolOption = {
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

export default class Brush extends Tool {
  type = ToolType.Brush;
  defaultToolOption: BrushToolOption = {
    char: "#",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
  };
  options: BrushToolOption = this.defaultToolOption;
  isDrawing = false;

  handleMouseDown(x: number, y: number): void {
    this.isDrawing = true;
    const newGrid = [...this.getGrid()];
    newGrid[y][x] = {
      char: this.options.char,
      charColor: this.options.charColor,
      backgroundColor: this.options.backgroundColor,
    };
    this.setGrid(newGrid);
  }

  handleMouseOver(x: number, y: number): void {
    if (this.isDrawing) {
      const newGrid = [...this.getGrid()];
      newGrid[y][x] = {
        char: this.options.char,
        charColor: this.options.charColor,
        backgroundColor: this.options.backgroundColor,
      };
      this.setGrid(newGrid);
    }
  }

  handleMouseUp(_x: number, _y: number): void {
    this.isDrawing = false;
  }

  handleDeselect(): void {
    this.isDrawing = false;
  }

  handleSelect(): void {
    this.options = this.getToolOptions()[this.type] as BrushToolOption;
  }

  handleMouseUpOutside(): void {
    this.isDrawing = false;
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
