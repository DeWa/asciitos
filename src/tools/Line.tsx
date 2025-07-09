import { RiCharacterRecognitionLine } from "react-icons/ri";
import {
  Button,
  CloseButton,
  type Color,
  ColorPicker,
  Dialog,
  Field,
  HStack,
  Input,
  parseColor,
  Portal,
} from "@chakra-ui/react";

import { PRESET_CHARS } from "../consts";
import { type GridCell, ToolType } from "../types";

import { Tool } from ".";

export type LineToolOption = {
  char: string;
  charColor: Color;
  backgroundColor: Color;
};

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

  handleMouseDown = (x: number, y: number): void => {
    if (!this.isDrawingPreview) {
      this.startingCell = [x, y];
      this.isDrawingPreview = true;
      this.originalGrid = [...this.getGrid()];
    } else {
      if (this.startingCell && this.isDrawingPreview && this.originalGrid) {
        this.saveHistory(this.getGrid());

        const newGrid = this.drawLine(this.originalGrid, x, y);
        this.setGrid(newGrid);

        this.originalGrid = null;
        this.isDrawingPreview = false;
        this.startingCell = null;
      }
    }
  };

  handleMouseOver = (x: number, y: number): void => {
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
  };

  handleSelect = (): void => {
    this.options = this.getToolOptions()[this.type] as LineToolOption;
  };

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
          charColor: this.options.charColor.toString("css"),
          backgroundColor: this.options.backgroundColor.toString("css"),
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
      <HStack>
        <Field.Root>
          <Field.Label>Character</Field.Label>
          <Input
            type="text"
            value={char}
            onChange={(e) => this.handleCustomCharChange(e.target.value)}
            placeholder="?"
            maxLength={1}
            width="30px"
            textAlign="center"
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Character</Field.Label>
          <Dialog.Root size="md">
            <Dialog.Trigger asChild>
              <Button color="fg.button">
                <RiCharacterRecognitionLine />
              </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content p="8">
                  <Dialog.Header>
                    <Dialog.Title>Select a character</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body pb="8">
                    <p>Select a character from the table below:</p>
                    <HStack gap="1" flexWrap="wrap" mt="3">
                      {PRESET_CHARS.map((char) => (
                        <Dialog.ActionTrigger asChild key={char}>
                          <Button
                            size="sm"
                            width="30px"
                            height="30px"
                            fontSize="16px"
                            fontFamily="monospace"
                            bg={char === this.options.char ? "gray.600" : "gray.700"}
                            color="white"
                            border="1px solid"
                            borderColor="gray.500"
                            _hover={{ bg: "gray.600" }}
                            onClick={() => this.handlePresetCharChange(char)}
                          >
                            {char}
                          </Button>
                        </Dialog.ActionTrigger>
                      ))}
                    </HStack>
                  </Dialog.Body>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton color="fg.button" size="xs" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Field.Root>
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
      </HStack>
    );
  }
}
