import { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";

import { Toaster } from "@/components/ui/toaster";

import AsciiGrid from "./components/AsciiGrid";
import Menu from "./components/Menu";
import PageSelector from "./components/PageSelector";
import ToolBar from "./components/ToolBar";
import { TOOLS } from "./consts";
import { type EditorOptions, type GridCell, type ToolOption, ToolType } from "./types";
import { useLocalStorage } from "./utils";

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
const initialGrid: GridCell[][] = Array(25)
  .fill(null)
  .map(() =>
    Array(80).fill({
      char: " ",
      charColor: "#ffffff",
      backgroundColor: "#000000",
    })
  );

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
  const [pages, setPages] = useLocalStorage<{ id: number; name: string; grid: GridCell[][] }[]>(
    "pages",
    [{ id: 0, name: "Main", grid: initialGrid }]
  );
  const [currentPageId, setCurrentPageId] = useState(0);
  const [actionHistory, setActionHistory] = useState<{
    history: GridCell[][][];
    index: number;
  }>({ history: [initialGrid], index: 0 });
  const [editorOptions, setEditorOptions] = useState<EditorOptions>({
    showGrid: true,
  });
  const [openPageSelector, setOpenPageSelector] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const setGrid = useCallback(
    (grid: GridCell[][]) => {
      setPages((prevPages) =>
        prevPages.map((page) => (page.id === currentPageId ? { ...page, grid } : page))
      );
    },
    [currentPageId]
  );

  useEffect(() => {
    for (const tool of Object.values(tools)) {
      tool.updateProps({
        setGrid,
        getGrid: () => pages[currentPageId].grid.map((row) => row.map((cell) => ({ ...cell }))),
        setToolOptions,
        getToolOptions: () => toolOptions,
        setActionHistory,
        getActionHistory: () => actionHistory,
      });
    }
  }, [toolOptions, selectedTool, pages, actionHistory, currentPageId, setGrid]);

  return (
    <AppContainer>
      <Title>Asciitos</Title>
      <EditorContainer>
        <ToolBar
          tools={tools}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          actionHistory={actionHistory}
          setActionHistory={setActionHistory}
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
          setOpenPageSelector={setOpenPageSelector}
          setOpenMenu={setOpenMenu}
          setGrid={setGrid}
        />
        <AsciiGrid
          grid={pages[currentPageId].grid}
          tools={tools}
          selectedTool={selectedTool}
          editorOptions={editorOptions}
        />
      </EditorContainer>
      <PageSelector
        open={openPageSelector}
        setOpen={setOpenPageSelector}
        pages={pages}
        setCurrentPageId={setCurrentPageId}
        setPages={setPages}
        currentPageId={currentPageId}
      />
      <Menu
        open={openMenu}
        setOpen={setOpenMenu}
        pages={pages}
        setPages={setPages}
        setCurrentPageId={setCurrentPageId}
      />
      <Toaster />
    </AppContainer>
  );
}

export default App;
