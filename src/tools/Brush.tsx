import { RiCharacterRecognitionLine } from "react-icons/ri";
import {
  Button,
  CloseButton,
  ColorPicker,
  Dialog,
  Field,
  HStack,
  Input,
  Portal,
} from "@chakra-ui/react";
import { parseColor } from "@chakra-ui/react";

import { PRESET_CHARS } from "../consts";
import { type GridCell, ToolType } from "../types";

import { Tool } from ".";

export type BrushToolOption = {
  char: string;
  charColor: string;
  backgroundColor: string;
};

export default class Brush extends Tool {
  type = ToolType.Brush;
  defaultToolOption: BrushToolOption = {
    char: "#",
    charColor: "#ffffff",
    backgroundColor: "#000000",
  };
  options: BrushToolOption = this.defaultToolOption;
  isDrawing = false;
  temporaryGrid: GridCell[][] = this.getGrid();

  handleMouseDown = (x: number, y: number): void => {
    if (!this.isDrawing) {
      this.isDrawing = true;
      this.temporaryGrid = this.getGrid();
      this.drawCharacter(x, y);
    }
  };

  handleMouseOver = (x: number, y: number): void => {
    if (this.isDrawing) {
      this.drawCharacter(x, y);
    }
  };

  handleMouseUp = (): void => {
    this.isDrawing = false;
    this.endDrawing();
  };

  handleDeselect = () => {
    this.isDrawing = false;
    this.endDrawing();
  };

  handleSelect = () => {
    this.options = this.getToolOptions()[this.type] as BrushToolOption;
  };

  handleMouseUpOutside = () => {
    this.isDrawing = false;
  };

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

  handleCharColorChange(color: string): void {
    const newOptions = { ...this.options, charColor: color };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  handleBgColorChange(color: string): void {
    const newOptions = { ...this.options, backgroundColor: color };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  private drawCharacter(x: number, y: number): void {
    this.temporaryGrid[y][x] = {
      char: this.options.char,
      charColor: this.options.charColor,
      backgroundColor: this.options.backgroundColor,
    };
    this.setGrid([...this.temporaryGrid]);
  }

  private endDrawing(): void {
    this.isDrawing = false;
    this.saveHistory(this.getGrid());
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
          defaultValue={parseColor(charColor)}
          size="md"
          onValueChangeEnd={(value) => this.handleCharColorChange(value.value.toString("css"))}
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
          defaultValue={parseColor(backgroundColor)}
          size="md"
          onValueChangeEnd={(value) => this.handleBgColorChange(value.value.toString("css"))}
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
