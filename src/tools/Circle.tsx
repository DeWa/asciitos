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

export type CircleToolOption = {
  char: string;
  charColor: Color;
  backgroundColor: Color;
};

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
        charColor: this.options.charColor.toString("css"),
        backgroundColor: this.options.backgroundColor.toString("css"),
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
