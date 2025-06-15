import { useState } from "react";
import styled from "styled-components";
import AsciiGrid from "./components/AsciiGrid";
import ToolBar from "./components/ToolBar";

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h1`
  color: #fff;
  font-family: monospace;
  margin: 0;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

function App() {
  const [selectedChar, setSelectedChar] = useState(" ");

  return (
    <AppContainer>
      <Title>Asciitos</Title>
      <EditorContainer>
        <ToolBar selectedChar={selectedChar} onSelect={setSelectedChar} />
        <AsciiGrid selectedChar={selectedChar} />
      </EditorContainer>
    </AppContainer>
  );
}

export default App;
