import { useState } from "react";
import styled from "@emotion/styled";
import AsciiGrid from "./components/AsciiGrid";
import ToolBar from "./components/ToolBar";
import { DEFAULT_TOOLBAR_PROPS } from "./consts";
import type { ToolbarProps } from "./types";

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
  const [toolbarProps, setToolbarProps] = useState<ToolbarProps>(DEFAULT_TOOLBAR_PROPS);

  return (
    <AppContainer>
      <Title>Asciitos</Title>
      <EditorContainer>
        <ToolBar toolbarProps={toolbarProps} onSetToolbarProps={setToolbarProps} />
        <AsciiGrid toolbarProps={toolbarProps} />
      </EditorContainer>
    </AppContainer>
  );
}

export default App;
