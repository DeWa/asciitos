import { Drawer, Portal, Button, Flex, Input, Box } from "@chakra-ui/react";
import React, { useRef } from "react";
import { toaster } from "@/components/ui/toaster";
import type { GridCell } from "../types";

interface MenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pages: { id: number; name: string; grid: GridCell[][] }[];
  setPages: (pages: { id: number; name: string; grid: GridCell[][] }[]) => void;
  setCurrentPageId: (id: number) => void;
}

const Menu: React.FC<MenuProps> = ({ open, setOpen, pages, setPages, setCurrentPageId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportPages = () => {
    try {
      const dataStr = JSON.stringify(pages, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "asciitos-pages.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toaster.create({
        title: "Export successful",
        description: "Pages exported to asciitos-pages.json",
        type: "success",
      });
    } catch {
      toaster.create({
        title: "Export failed",
        description: "Failed to export pages",
        type: "error",
      });
    }
  };

  const handleImportPages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedPages = JSON.parse(content);

        // Validate the imported data structure
        if (!Array.isArray(importedPages)) {
          throw new Error("Invalid file format: expected an array of pages");
        }
        // Validate each page has required properties
        for (const page of importedPages) {
          if (Number.isNaN(page.id) || !page.name || !Array.isArray(page.grid)) {
            throw new Error("Invalid page structure: missing required properties");
          }
        }

        setPages(importedPages);
        setCurrentPageId(importedPages[0].id);

        toaster.create({
          title: "Import successful",
          description: `${importedPages.length} pages imported`,
          type: "success",
        });
      } catch (error) {
        console.error(error);
        toaster.create({
          title: "Import failed",
          description: "Invalid file format or corrupted data",
          type: "error",
        });
      }
    };
    reader.readAsText(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="bg.primary" p="4">
              <Drawer.Header>
                <Drawer.Title>Menu</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body pt={8}>
                <Flex direction="column" gap={4}>
                  <Box>
                    <Button colorPalette="secondary" w="100%" onClick={handleExportPages}>
                      Export All Pages
                    </Button>
                  </Box>
                  <Box>
                    <Button colorPalette="secondary" w="100%" onClick={handleImportClick}>
                      Import Pages
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportPages}
                      display="none"
                    />
                  </Box>
                </Flex>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default Menu;
