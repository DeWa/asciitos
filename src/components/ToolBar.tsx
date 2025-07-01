import React from "react";
import styled from "@emotion/styled";
import { Button, HStack, Icon, SegmentGroup, Switch } from "@chakra-ui/react";
import { ToolType, type EditorOptions, type GridCell } from "../types";
import type { Tool } from "../tools";

// Icons
import { FaBroom, FaFill } from "react-icons/fa6";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { PiTextAa, PiGridFour, PiSquareLight } from "react-icons/pi";
import { CiText } from "react-icons/ci";
import { FaRedo, FaUndo } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 4px;
`;

const MainToolBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ToolSelectContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const EditorControllerContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ToolOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

interface ToolBarProps {
  tools: Record<ToolType, Tool>;
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  pages: Record<string, GridCell[][]>;
  setPages: (pages: Record<string, GridCell[][]>) => void;
  actionHistory: { history: GridCell[][][]; index: number };
  setActionHistory: (actionHistory: { history: GridCell[][][]; index: number }) => void;
  editorOptions: EditorOptions;
  setEditorOptions: (editorOptions: EditorOptions) => void;
  setOpenPageSelector: (open: boolean) => void;
  setGrid: (grid: GridCell[][]) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({
  tools,
  selectedTool,
  setSelectedTool,
  pages,
  setPages,
  actionHistory,
  setActionHistory,
  editorOptions,
  setEditorOptions,
  setOpenPageSelector,
  setGrid,
}) => {
  const onToolSelect = (tool: ToolType) => {
    tools[selectedTool].handleDeselect();
    setSelectedTool(tool);
    tools[tool].handleSelect();
  };

  const onGridToggle = (checked: boolean) => {
    setEditorOptions({ ...editorOptions, showGrid: checked });
  };

  const onMenuClick = () => {
    setOpenPageSelector(true);
  };

  const onUndoClick = () => {
    const currentHistory = actionHistory;
    if (currentHistory.history.length > 0 && currentHistory.index > 0) {
      const previousIndex = currentHistory.index - 1;
      const previousGrid = currentHistory.history[previousIndex];

      setGrid(previousGrid);
      setActionHistory({
        history: currentHistory.history,
        index: previousIndex,
      });
    }
  };

  const onRedoClick = () => {
    const currentHistory = actionHistory;
    if (
      currentHistory.history.length > 0 &&
      currentHistory.index < currentHistory.history.length - 1
    ) {
      setGrid(currentHistory.history[currentHistory.index + 1]);
      setActionHistory({
        history: currentHistory.history,
        index: currentHistory.index + 1,
      });
    }
  };

  const toolItems = [
    {
      value: ToolType.Brush,
      label: (
        <HStack gap={2}>
          <FaBroom />
          Brush
        </HStack>
      ),
    },
    {
      value: ToolType.Text,
      label: (
        <HStack gap={2}>
          <PiTextAa />
          Text
        </HStack>
      ),
    },
    {
      value: ToolType.Line,
      label: (
        <HStack gap={2}>
          <TbLine />
          Line
        </HStack>
      ),
    },
    {
      value: ToolType.Circle,
      label: (
        <HStack gap={2}>
          <FaRegCircle />
          Circle
        </HStack>
      ),
    },
    {
      value: ToolType.Fill,
      label: (
        <HStack gap={2}>
          <FaFill />
          Fill
        </HStack>
      ),
    },
    {
      value: ToolType.Rectangle,
      label: (
        <HStack gap={2}>
          <LuRectangleHorizontal />
          Rectangle
        </HStack>
      ),
    },
    {
      value: ToolType.TextArt,
      label: (
        <HStack gap={2}>
          <CiText />
          TextArt
        </HStack>
      ),
    },
  ];

  return (
    <Container>
      <MainToolBarContainer>
        <ToolSelectContainer>
          <SegmentGroup.Root
            value={selectedTool}
            size="lg"
            onValueChange={(e) => onToolSelect(e.value as ToolType)}
          >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items p={4} items={toolItems} />
          </SegmentGroup.Root>
        </ToolSelectContainer>
        <EditorControllerContainer>
          <HStack>
            {/* Toggle Grid */}
            <Switch.Root
              colorPalette="primary"
              size="lg"
              checked={editorOptions.showGrid}
              onCheckedChange={(value) => onGridToggle(value.checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
                <Switch.Indicator fallback={<Icon as={PiSquareLight} />}>
                  <Icon as={PiGridFour} color="black" />
                </Switch.Indicator>
              </Switch.Control>
            </Switch.Root>
            {/* Undo */}
            <Button size="md" title="Undo" variant="ghost" onClick={onUndoClick}>
              <FaUndo />
            </Button>
            {/* Redo */}
            <Button size="md" title="Redo" variant="ghost" onClick={onRedoClick}>
              <FaRedo />
            </Button>
            <Button size="md" title="Menu" variant="ghost" onClick={onMenuClick}>
              <FaBars />
            </Button>
          </HStack>
        </EditorControllerContainer>
      </MainToolBarContainer>
      <ToolOptionsContainer key={tools[selectedTool].type}>
        {tools[selectedTool].getToolOptionsNode()}
      </ToolOptionsContainer>
    </Container>
  );
};

export default ToolBar;
