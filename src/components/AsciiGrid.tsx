import React, { useState, useRef } from "react";
import styled from "styled-components";

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

const GridCell = styled.div<{ isSelected: boolean }>`
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? "#4a4a4a" : "#333")};
  color: #fff;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4a4a4a;
  }
`;

interface AsciiGridProps {
  selectedChar: string;
}

const AsciiGrid: React.FC<AsciiGridProps> = ({ selectedChar }) => {
  const [grid, setGrid] = useState<string[][]>(
    Array(25)
      .fill(null)
      .map(() => Array(80).fill(" "))
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const isDrawing = useRef(false);

  const handleCellClick = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = selectedChar;
    setGrid(newGrid);
    setSelectedCell([row, col]);
  };

  const handleMouseDown = (row: number, col: number) => {
    isDrawing.current = true;
    handleCellClick(row, col);
  };

  const handleMouseOver = (row: number, col: number) => {
    if (isDrawing.current) {
      handleCellClick(row, col);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // Add event listeners for mouse up outside the grid
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDrawing.current = false;
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  return (
    <GridContainer onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
            onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
          >
            {cell}
          </GridCell>
        ))
      )}
    </GridContainer>
  );
};

export default AsciiGrid;
