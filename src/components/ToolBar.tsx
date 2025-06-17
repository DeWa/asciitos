import React, { useState } from "react";
import styled from "@emotion/styled";
import { ColorPicker, HStack, Portal, type Color } from "@chakra-ui/react";
import { ToolType, type ToolbarProps } from "../types";

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

const CharacterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const PresetContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const PresetButton = styled.button<{ $isSelected: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isSelected ? "#4a4a4a" : "#333")};
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

interface ToolBarProps {
  toolbarProps: ToolbarProps;
  onSetToolbarProps: (toolbarProps: ToolbarProps) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ toolbarProps, onSetToolbarProps }) => {
  const [customChar, setCustomChar] = useState("");

  const presetChars = [" ", ".", "-", "+", "*", "#", "@", "&", "%", "$"];

  const handleCustomCharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomChar(value);
    if (value.length > 0) {
      onSelect(value[value.length - 1]);
    }
  };

  const { selectedChar, selectedTool, selectedCharColor } = toolbarProps;

  const onSelect = (char: string) => {
    onSetToolbarProps({ ...toolbarProps, selectedChar: char });
  };

  const onToolSelect = (tool: ToolType) => {
    onSetToolbarProps({ ...toolbarProps, selectedTool: tool });
  };

  const onCharColorChange = (color: Color) => {
    onSetToolbarProps({ ...toolbarProps, selectedCharColor: color });
  };

  return (
    <Container>
      <div style={{ display: "flex", gap: "10px" }}>
        <ToolButton
          $isSelected={selectedTool === ToolType.Brush}
          onClick={() => onToolSelect(ToolType.Brush)}
        >
          Brush
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Line}
          onClick={() => onToolSelect(ToolType.Line)}
        >
          Line
        </ToolButton>
        <ToolButton
          $isSelected={selectedTool === ToolType.Circle}
          onClick={() => onToolSelect(ToolType.Circle)}
        >
          Circle
        </ToolButton>
      </div>
      <CharacterContainer>
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
              $isSelected={selectedChar === char}
              onClick={() => onSelect(char)}
            >
              {char}
            </PresetButton>
          ))}
        </PresetContainer>
        <ColorPicker.Root
          defaultValue={selectedCharColor}
          size="md"
          onValueChangeEnd={(value) => onCharColorChange(value.value)}
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
      </CharacterContainer>
    </Container>
  );
};

export default ToolBar;
