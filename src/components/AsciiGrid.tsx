import React from "react";
import styled from "@emotion/styled";
import type { GridCell, ToolType } from "../types";
import type { Tool } from "../tools";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(80, 1fr);
  grid-template-rows: repeat(25, 1fr);
  background-color: #2a2a2a;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 16px;
  line-height: 1;
  width: 100%;
`;

const GridCell = styled.div<{ $isSelected: boolean; $isBlinking: boolean }>`
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isBlinking ? "left" : "center")};
  background-color: ${(props) => (props.$isSelected ? "#4a4a4a" : "#333")};
  color: #fff;
  cursor: pointer;
  user-select: none;
  border: 1px solid #444;
  animation: ${(props) => (props.$isBlinking ? "blinker 1s infinite" : "none")};

  &:hover {
    background-color: #4a4a4a;
  }
`;

interface AsciiGridProps {
  grid: GridCell[][];
  tools: Record<ToolType, Tool>;
  selectedTool: ToolType;
}

const AsciiGrid: React.FC<AsciiGridProps> = ({ grid, tools, selectedTool }) => {
  const handleMouseDown = (row: number, col: number) => {
    tools[selectedTool].handleMouseDown(row, col);
  };

  const handleMouseOver = (row: number, col: number) => {
    tools[selectedTool].handleMouseOver(row, col);
  };

  const handleMouseUp = (row: number, col: number) => {
    tools[selectedTool].handleMouseUp(row, col);
  };

  // Add global event listener for mouse and keyboard events
  React.useEffect(() => {
    window.addEventListener("mouseup", tools[selectedTool].handleMouseUpOutside);
    window.addEventListener("keydown", tools[selectedTool].handleKeyDown);
    return () => {
      window.removeEventListener("mouseup", tools[selectedTool].handleMouseUpOutside);
      window.removeEventListener("keydown", tools[selectedTool].handleKeyDown);
    };
  }, [tools, selectedTool]);

  return (
    <GridContainer onMouseLeave={() => handleMouseUp(0, 0)}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            $isSelected={false}
            $isBlinking={cell.isBlinking ?? false}
            onMouseDown={() => handleMouseDown(colIndex, rowIndex)}
            onMouseOver={() => handleMouseOver(colIndex, rowIndex)}
            onMouseUp={() => handleMouseUp(colIndex, rowIndex)}
            style={{
              backgroundColor: cell.backgroundColor.toString("css"),
              color: cell.charColor.toString("css"),
            }}
          >
            {cell.char}
          </GridCell>
        ))
      )}
    </GridContainer>
  );
};

export default AsciiGrid;
