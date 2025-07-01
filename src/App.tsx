import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import AsciiGrid from "./components/AsciiGrid";
import ToolBar from "./components/ToolBar";
import { TOOLS } from "./consts";
import { ToolType, type EditorOptions, type GridCell, type ToolOption } from "./types";
import { parseColor } from "@chakra-ui/react";
import PageSelector from "./components/PageSelector";

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

const tools = TOOLS;

function App() {
  const [selectedTool, setSelectedTool] = useState<ToolType>(ToolType.Brush);
  const [toolOptions, setToolOptions] = useState<Record<ToolType, ToolOption>>(
    Object.fromEntries(
      Object.keys(TOOLS).map((toolType) => [
        toolType as ToolType,
        TOOLS[toolType as ToolType].defaultToolOption,
      ])
    ) as Record<ToolType, ToolOption>
  );
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
  const [pages, setPages] = useState<Record<string, GridCell[][]>>({
    Main: grid,
  });
  const [actionHistory, setActionHistory] = useState<{
    history: GridCell[][][];
    index: number;
  }>({ history: [grid], index: 0 });
  const [editorOptions, setEditorOptions] = useState<EditorOptions>({
    showGrid: true,
  });
  const [openPageSelector, setOpenPageSelector] = useState(false);

  useEffect(() => {
    for (const tool of Object.values(tools)) {
      tool.updateProps({
        setGrid,
        getGrid: () => grid.map((row) => row.map((cell) => ({ ...cell }))),
        setToolOptions,
        getToolOptions: () => toolOptions,
        setActionHistory,
        getActionHistory: () => actionHistory,
      });
    }
  }, [grid, toolOptions, selectedTool, pages, actionHistory]);

  return (
    <AppContainer>
      <Title>Asciitos</Title>
      <EditorContainer>
        <ToolBar
          tools={tools}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          pages={pages}
          setPages={setPages}
          actionHistory={actionHistory}
          setActionHistory={setActionHistory}
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
          setOpenPageSelector={setOpenPageSelector}
          setGrid={setGrid}
        />
        <AsciiGrid
          grid={grid}
          tools={tools}
          selectedTool={selectedTool}
          editorOptions={editorOptions}
        />
      </EditorContainer>
      <PageSelector open={openPageSelector} setOpen={setOpenPageSelector} />
    </AppContainer>
  );
}

export default App;
