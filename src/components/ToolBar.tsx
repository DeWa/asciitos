import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 4px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  background-color: #333;
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px;
  width: 100%;
  max-width: 200px;

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const PresetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const PresetButton = styled.button<{ isSelected: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isSelected ? "#4a4a4a" : "#333")};
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

interface CharacterSelectorProps {
  onSelect: (char: string) => void;
  selectedChar: string;
}

const ToolBar: React.FC<CharacterSelectorProps> = ({
  onSelect,
  selectedChar,
}) => {
  const [customChar, setCustomChar] = useState("");

  const presetChars = [" ", ".", "-", "+", "*", "#", "@", "&", "%", "$"];

  const handleCustomCharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomChar(value);
    if (value.length > 0) {
      onSelect(value[value.length - 1]);
    }
  };

  return (
    <Container>
      <Input
        type="text"
        value={customChar}
        onChange={handleCustomCharChange}
        placeholder="Type a character..."
        maxLength={1}
      />
      <PresetContainer>
        {presetChars.map((char) => (
          <PresetButton
            key={char}
            isSelected={selectedChar === char}
            onClick={() => onSelect(char)}
          >
            {char}
          </PresetButton>
        ))}
      </PresetContainer>
    </Container>
  );
};

export default ToolBar;
