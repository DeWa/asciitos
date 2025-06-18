import React, { useState } from "react";
import styled from "@emotion/styled";
import { ToolType, type ToolbarProps } from "../types";
import Brush from "../tools/Brush";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
import { parseColor } from "@chakra-ui/react";
import type { GridCell } from "../types";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(80, 1fr);
  grid-template-rows: repeat(25, 1fr);
  gap: 1px;
  background-color: #2a2a2a;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 16px;
  line-height: 1;
  width: 100%;
`;

const GridCell = styled.div<{ $isSelected: boolean }>`
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isSelected ? "#4a4a4a" : "#333")};
  color: #fff;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a4a4a;
  }
`;

interface AsciiGridProps {
  toolbarProps: ToolbarProps;
}

const tools = {
  [ToolType.Brush]: new Brush(),
  [ToolType.Line]: new Line(),
  [ToolType.Circle]: new Circle(),
};

const AsciiGrid: React.FC<AsciiGridProps> = ({ toolbarProps }) => {
  const { selectedChar, selectedTool } = toolbarProps;

  const [grid, setGrid] = useState<GridCell[][]>(
    Array(25)
      .fill(null)
      .map(() =>
        Array(80).fill({
          char: " ",
          charColor: parseColor("#ffffff"),
          backgroundColor: parseColor("#000000"),
        })
      )
  );

  // Update tool props
  for (const tool of Object.values(tools)) {
    tool.updateProps({ setGrid, getGrid: () => grid, selectedChar, toolbarProps });
  }

  const handleMouseDown = (row: number, col: number) => {
    tools[selectedTool].handleMouseDown(row, col);
  };

  const handleMouseOver = (row: number, col: number) => {
    tools[selectedTool].handleMouseOver(row, col);
  };

  const handleMouseUp = (row: number, col: number) => {
    tools[selectedTool].handleMouseUp(row, col);
  };

  // Add event listeners for mouse up outside the grid
  React.useEffect(() => {
    window.addEventListener("mouseup", tools[selectedTool].handleMouseUpOutside);
    return () => {
      window.removeEventListener("mouseup", tools[selectedTool].handleMouseUpOutside);
    };
  }, []);

  return (
    <GridContainer onMouseLeave={() => handleMouseUp(0, 0)}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            $isSelected={false}
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
