import {
  ColorPicker,
  createListCollection,
  HStack,
  Input,
  parseColor,
  Portal,
  Select,
  Slider,
  type Color,
} from "@chakra-ui/react";
import { Tool } from ".";
import { ToolType, type GridCell } from "../types";
import figlet from "figlet";

export type TextArtToolOption = {
  text: string;
  charColor: Color;
  backgroundColor: Color;
  width: number;
  horizontalLayout: figlet.KerningMethods;
  verticalLayout: figlet.KerningMethods;
  whitespaceBreak: boolean;
};

const layoutCollection = createListCollection({
  items: [
    { label: "Default", value: "default" },
    { label: "Full", value: "full" },
    { label: "Fitted", value: "fitted" },
    { label: "Controlled smushing", value: "controlled smushing" },
    { label: "Universal smushing", value: "universal smushing" },
  ],
});

export default class TextArt extends Tool {
  type = ToolType.TextArt;
  private font: figlet.Fonts = "Standard";
  private originalGrid: GridCell[][] = this.getGrid();
  private temporaryGrid: GridCell[][] = this.getGrid();
  defaultToolOption: TextArtToolOption = {
    text: "",
    charColor: parseColor("#ffffff"),
    backgroundColor: parseColor("#000000"),
    width: 80,
    horizontalLayout: "default",
    verticalLayout: "default",
    whitespaceBreak: false,
  };
  options: TextArtToolOption = this.defaultToolOption;

  constructor() {
    super();
    figlet.defaults({ fontPath: "assets/asciifonts" });
    figlet.preloadFonts(["Standard"]);
  }

  private printTextToGrid(grid: GridCell[][], text: string, x: number, y: number): GridCell[][] {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    const asciiArt = figlet.textSync(text, {
      font: this.font,
      width: this.options.width,
      horizontalLayout: this.options.horizontalLayout,
      verticalLayout: this.options.verticalLayout,
      whitespaceBreak: this.options.whitespaceBreak,
    });
    if (!asciiArt) return grid;

    const lines = asciiArt.split("\n");
    const offsetX = 10;
    const offsetY = 2;

    lines.forEach((line, dy) => {
      [...line].forEach((char, dx) => {
        const targetY = y + dy - offsetY;
        const targetX = x + dx - offsetX;

        if (
          targetY >= 0 &&
          targetY < newGrid.length &&
          targetX >= 0 &&
          targetX < newGrid[0].length &&
          char !== " "
        ) {
          newGrid[targetY][targetX] = {
            char,
            charColor: this.options.charColor,
            backgroundColor: this.options.backgroundColor,
          };
        }
      });
    });

    return newGrid;
  }

  override handleMouseDown = (x: number, y: number): void => {
    if (!this.options.text) return;

    this.temporaryGrid = this.printTextToGrid(this.originalGrid, this.options.text, x, y);
    this.setGrid([...this.temporaryGrid]);
    this.originalGrid = [...this.temporaryGrid];
    this.saveHistory([...this.temporaryGrid]);
  };

  override handleMouseOver = (x: number, y: number): void => {
    if (!this.options.text) return;
    this.setGrid(this.originalGrid);
    this.temporaryGrid = this.printTextToGrid(this.originalGrid, this.options.text, x, y);
    this.setGrid([...this.temporaryGrid]);
  };

  override handleSelect = (): void => {
    this.originalGrid = this.getGrid();
    this.temporaryGrid = this.getGrid();
    this.options = this.getToolOptions()[this.type] as TextArtToolOption;
  };

  override handleDeselect = (): void => {
    this.setGrid([...this.originalGrid]);
  };

  override handleUndo = (grid: GridCell[][]): void => {
    this.originalGrid = grid;
    this.temporaryGrid = grid;
  };

  getFonts(): Promise<string[]> {
    return new Promise((resolve) => {
      figlet.fonts((err, fonts) => {
        if (err || !fonts) {
          resolve([]);
          return;
        }
        resolve(fonts);
      });
    });
  }

  handleTextChange(text: string): void {
    const newOptions = { ...this.options, text };
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

  handleWidthChange(width: number[]): void {
    const newOptions = { ...this.options, width: width[0] };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  handleHorizontalLayoutChange(layout: string): void {
    const newOptions = { ...this.options, horizontalLayout: layout as figlet.KerningMethods };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  handleVerticalLayoutChange(layout: string): void {
    const newOptions = { ...this.options, verticalLayout: layout as figlet.KerningMethods };
    this.setToolOptions({ ...this.getToolOptions(), [this.type]: newOptions });
    this.options = newOptions;
  }

  public getToolOptionsNode(): React.ReactNode {
    const { charColor, backgroundColor } = this.options;

    return (
      <>
        {/* Set text */}
        <Input
          placeholder="Text"
          size="xs"
          value={this.options.text}
          onChange={(e) => this.handleTextChange(e.target.value)}
        />
        {/* Set horizontal layout */}
        <Select.Root
          collection={layoutCollection}
          size="sm"
          variant="subtle"
          onValueChange={(value) => this.handleHorizontalLayoutChange(value.value[0])}
        >
          <Select.HiddenSelect />
          <Select.Label>Horizontal Layout</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={this.options.horizontalLayout} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {layoutCollection.items.map((layout) => (
                  <Select.Item item={layout} key={layout.value}>
                    {layout.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        {/* Set vertical layout */}
        <Select.Root
          collection={layoutCollection}
          size="sm"
          variant="subtle"
          onValueChange={(value) => this.handleHorizontalLayoutChange(value.value[0])}
        >
          <Select.HiddenSelect />
          <Select.Label>Vertical Layout</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={this.options.verticalLayout} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {layoutCollection.items.map((layout) => (
                  <Select.Item item={layout} key={layout.value}>
                    {layout.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        {/* Set width */}
        <Slider.Root
          maxW="sm"
          size="sm"
          defaultValue={[this.options.width]}
          onValueChangeEnd={(value) => this.handleWidthChange(value.value)}
        >
          <HStack justify="space-between">
            <Slider.Label>Width</Slider.Label>
            <Slider.ValueText />
          </HStack>
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs rounded="l1" />
          </Slider.Control>
        </Slider.Root>
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
      </>
    );
  }
}
