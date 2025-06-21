import React from "react";
import styled from "@emotion/styled";
import { FaBroom, FaFill } from "react-icons/fa6";
import { TbLine } from "react-icons/tb";
import { FaRegCircle } from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { PiTextAa } from "react-icons/pi";
import { CiText } from "react-icons/ci";
import { ToolType } from "../types";
import type { Tool } from "../tools";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 4px;
`;

const ToolSelectContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ToolButton = styled.button<{ $isSelected: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) => (props.$isSelected ? "#4a4a4a" : "#333")};
  border: 1px solid #444;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;

  &:hover {
    background-color: #4a4a4a;
  }
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
}

const ToolBar: React.FC<ToolBarProps> = ({ tools, selectedTool, setSelectedTool }) => {
  const onToolSelect = (tool: ToolType) => {
    tools[selectedTool].handleDeselect();
    setSelectedTool(tool);
    tools[tool].handleSelect();
  };

  return (
    <Container>
      <ToolSelectContainer>
        <ToolButton
          $isSelected={selectedTool === ToolType.Brush}
          onClick={() => onToolSelect(ToolType.Brush)}
          title="Brush"
        >
          <FaBroom />
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Text}
          onClick={() => onToolSelect(ToolType.Text)}
          title="Text"
        >
          <PiTextAa />
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Line}
          onClick={() => onToolSelect(ToolType.Line)}
          title="Line"
        >
          <TbLine />
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Circle}
          onClick={() => onToolSelect(ToolType.Circle)}
          title="Circle"
        >
          <FaRegCircle />
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Fill}
          onClick={() => onToolSelect(ToolType.Fill)}
          title="Fill"
        >
          <FaFill />
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Rectangle}
          onClick={() => onToolSelect(ToolType.Rectangle)}
          title="Rectangle"
        >
          <LuRectangleHorizontal />
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.TextArt}
          onClick={() => onToolSelect(ToolType.TextArt)}
          title="TextArt"
        >
          <CiText />
        </ToolButton>
      </ToolSelectContainer>
      <ToolOptionsContainer key={tools[selectedTool].type}>
        {tools[selectedTool].getToolOptionsNode()}
      </ToolOptionsContainer>
    </Container>
  );
};

export default ToolBar;
