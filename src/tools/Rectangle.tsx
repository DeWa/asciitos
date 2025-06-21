import {
  ColorPicker,
  createListCollection,
  HStack,
  IconButton,
  Input,
  parseColor,
  Portal,
  Select,
  useSelectContext,
  type Color,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { MdOutlineRectangle, MdRectangle } from "react-icons/md";

import { Tool } from ".";
import { ToolType, type GridCell } from "../types";
import { PRESET_CHARS } from "../consts";

export type RectangleToolOption = {
  char: string;
  charColor: Color;
  backgroundColor: Color;
  fillType: RectangleFillType;
};

export enum RectangleFillType {
  Outline = "Outline",
  Filled = "Filled",
}

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

const SelectTrigger = () => {
  const select = useSelectContext();
  const items = select.selectedItems as {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  return (
    <IconButton px="2" variant="outline" size="sm" {...select.getTriggerProps()}>
      {select.hasSelectedItems ? items[0].icon : <MdOutlineRectangle />}
    </IconButton>
  );
};

export default class Rectangle extends Tool {
  type = ToolType.Rectangle;
  isDrawingPreview = false;
  startCorner: [number, number] | null = null;
  originalGrid: GridCell[][] | null = null;
  defaultToolOption: RectangleToolOption = {
    char: "#",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
    fillType: RectangleFillType.Outline,
  };
  options: RectangleToolOption = this.defaultToolOption;

  handleMouseDown = (x: number, y: number): void => {
    if (!this.isDrawingPreview) {
      this.startCorner = [x, y];
      this.isDrawingPreview = true;
      this.originalGrid = this.getGrid().map((row) => row.map((cell) => ({ ...cell })));
    } else {
      if (this.startCorner && this.isDrawingPreview && this.originalGrid) {
        const newGrid = this.drawRectangle(this.originalGrid, x, y);
        this.setGrid(newGrid);

        this.originalGrid = null;
        this.isDrawingPreview = false;
        this.startCorner = null;
      }
    }
  };

  handleMouseOver = (x: number, y: number): void => {
    if (this.isDrawingPreview && this.startCorner && this.originalGrid) {
      const originalGrid = this.originalGrid.map((row) => row.map((cell) => ({ ...cell })));
      const newGrid = this.drawRectangle(originalGrid, x, y);
      this.setGrid(newGrid);
    }
  };

  handleSelect = (): void => {
    this.options = this.getToolOptions()[this.type] as RectangleToolOption;
  };

  private drawRectangle(grid: GridCell[][], x: number, y: number): GridCell[][] {
    if (!this.startCorner) return grid;

    const [startX, startY] = this.startCorner;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    // Calculate rectangle bounds
    const minX = Math.min(startX, x);
    const maxX = Math.max(startX, x);
    const minY = Math.min(startY, y);
    const maxY = Math.max(startY, y);

    // Check if shift is pressed for filled rectangle (to be implemented in toolbar)
    const isFilled = this.options.fillType === RectangleFillType.Filled;

    // Draw the rectangle
    for (let currentY = minY; currentY <= maxY; currentY++) {
      for (let currentX = minX; currentX <= maxX; currentX++) {
        // For filled rectangle, draw all cells
        // For outline, only draw if we're on the border
        if (
          isFilled ||
          currentX === minX ||
          currentX === maxX ||
          currentY === minY ||
          currentY === maxY
        ) {
          if (
            currentY >= 0 &&
            currentY < newGrid.length &&
            currentX >= 0 &&
            currentX < newGrid[0].length
          ) {
            newGrid[currentY][currentX] = {
              char: this.options.char,
              charColor: this.options.charColor,
              backgroundColor: this.options.backgroundColor,
            };
          }
        }
      }
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

  handleFillTypeChange(changedValue: string[]): void {
    const value = RectangleFillType[changedValue[0] as keyof typeof RectangleFillType];
    const newOptions = { ...this.options, fillType: value };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  public getToolOptionsNode(): React.ReactNode {
    const { char, charColor, backgroundColor } = this.options;

    const fillTypeCollection = createListCollection({
      items: [
        { label: "Outline", value: RectangleFillType.Outline, icon: <MdOutlineRectangle /> },
        { label: "Filled", value: RectangleFillType.Filled, icon: <MdRectangle /> },
      ],
    });

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
        {/* Character Color Picker */}
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
        {/* Background Color Picker */}
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
        {/* Fill Type Selector */}
        <Select.Root
          positioning={{ sameWidth: false }}
          collection={fillTypeCollection}
          defaultValue={[this.options.fillType]}
          size="sm"
          onValueChange={(e) => this.handleFillTypeChange(e.value)}
        >
          <Select.HiddenSelect />
          <Select.Label>Fill Type</Select.Label>
          <Select.Control>
            <SelectTrigger />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content minW="32">
                {fillTypeCollection.items.map((fillType) => (
                  <Select.Item item={fillType} key={fillType.value}>
                    <HStack>
                      {fillType.icon}
                      {fillType.label}
                    </HStack>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </>
    );
  }
}
