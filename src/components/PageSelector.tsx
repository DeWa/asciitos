import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Drawer,
  Flex,
  Grid,
  GridItem,
  Input,
  Portal,
} from "@chakra-ui/react";

import { toaster } from "@/components/ui/toaster";

import type { GridCell } from "../types";

interface PageSelectorProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  pages: { id: number; name: string; grid: GridCell[][] }[];
  setCurrentPageId: (id: number) => void;
  setPages: (pages: { id: number; name: string; grid: GridCell[][] }[]) => void;
  currentPageId: number;
}

const EditedPageCell = ({
  page,
  newName,
  handlePageRename,
  setNewName,
}: {
  page: string;
  newName: string;
  setNewName: (newName: string) => void;
  handlePageRename: (page: string, newName: string) => void;
}) => {
  return (
    <Grid gap={0} gridTemplateColumns="70% 30%">
      <GridItem w="100%">
        <Input
          flex="1"
          placeholder={page}
          value={newName}
          w="100%"
          px={2}
          onChange={(e) => setNewName(e.target.value)}
        />
      </GridItem>
      <GridItem>
        <Button
          bg="bg.success"
          rounded="none"
          w="100%"
          onClick={() => handlePageRename(page, newName)}
        >
          Submit
        </Button>
      </GridItem>
    </Grid>
  );
};

const PageCell = ({
  page,
  handlePageSelect,
  handleSetPageToBeRenamed,
  handleSetPageToBeDeleted,
  isCurrentPage,
}: {
  page: string;
  handlePageSelect: (page: string) => void;
  handleSetPageToBeRenamed: (page: string) => void;
  handleSetPageToBeDeleted: (page: string) => void;
  isCurrentPage: boolean;
}) => {
  return (
    <Grid gap={0} gridTemplateColumns="70% 30%">
      <GridItem w="100%">
        <Button
          key={page}
          onClick={() => handlePageSelect(page)}
          w="100%"
          bg={isCurrentPage ? "bg.buttonPrimaryActive" : "bg.button"}
          rounded="none"
        >
          {page}
        </Button>
      </GridItem>
      <GridItem w="100%">
        <Button w="50%" onClick={() => handleSetPageToBeRenamed(page)} rounded="none">
          <FaEdit />
        </Button>
        <Button w="50%" onClick={() => handleSetPageToBeDeleted(page)} rounded="none">
          <FaTrash />
        </Button>
      </GridItem>
    </Grid>
  );
};

const DeleteConfirmation = ({
  open,
  setOpen,
  handlePageDelete,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  handlePageDelete: () => void;
}) => (
  <Dialog.Root role="alertdialog" lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content p={6}>
          <Dialog.Header>
            <Dialog.Title>Are you sure?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>
              This action cannot be undone. This will permanently delete the page and all its
              content.
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button bg="bg.button">Cancel</Button>
            </Dialog.ActionTrigger>
            <Dialog.ActionTrigger asChild>
              <Button bg="bg.buttonWarning" onClick={() => handlePageDelete()}>
                Delete
              </Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" bg="bg.button" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);

const PageSelector: React.FC<PageSelectorProps> = ({
  open,
  setOpen,
  pages,
  setPages,
  setCurrentPageId,
  currentPageId,
}) => {
  const handleAddPage = () => {
    let newPage = "New Page";
    let i = 1;
    while (pages.find((page) => page.name === newPage)) {
      newPage = `New Page ${i}`;
      i++;
    }
    setPages([
      ...pages,
      {
        id: pages.length,
        name: newPage,
        grid: Array(25).fill(
          Array(80).fill({
            char: " ",
            charColor: parseColor("#ffffff"),
            backgroundColor: parseColor("#000000"),
          })
        ),
      },
    ]);
    setCurrentPageId(pages.length);
  };
  const handlePageRename = (page: string, newName: string) => {
    const newPages = pages.map((p) => (p.name === page ? { ...p, name: newName } : p));
    setPages(newPages);
    setRenamedPage(null);
    setNewName("");
  };

  const handlePageSelect = (page: string) => {
    setCurrentPageId(pages.find((p) => p.name === page)?.id ?? 0);
  };
  const handleSetPageToBeRenamed = (page: string) => {
    setRenamedPage(page);
    setNewName(page);
  };
  const handleSetPageToBeDeleted = (page: string) => {
    setDeletedPage(page);
    setDeleteConfirmationOpen(true);
  };

  const handlePageDelete = (page: string | null) => {
    if (!page) return;
    if (pages.length === 1) {
      toaster.create({
        title: "You cannot delete the last page",
        type: "error",
      });
      return;
    }
    const newPages = pages.filter((p) => p.name !== page).map((p, i) => ({ ...p, id: i }));
    setPages(newPages);
    setCurrentPageId(newPages[0].id);
    setDeletedPage(null);
    setDeleteConfirmationOpen(false);
  };

  const [renamedPage, setRenamedPage] = useState<string | null>(null);
  const [deletedPage, setDeletedPage] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);

  return (
    <>
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="bg.primary" p="4">
              <Drawer.Header>
                <Drawer.Title>Select Page</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body pt={8}>
                <Flex direction="column" gap={2}>
                  {pages.map((page) => (
                    <Box key={page.id}>
                      {renamedPage === page.name ? (
                        <EditedPageCell
                          page={page.name}
                          newName={newName}
                          handlePageRename={handlePageRename}
                          setNewName={setNewName}
                        />
                      ) : (
                        <PageCell
                          page={page.name}
                          handleSetPageToBeRenamed={() => handleSetPageToBeRenamed(page.name)}
                          handleSetPageToBeDeleted={() => handleSetPageToBeDeleted(page.name)}
                          handlePageSelect={handlePageSelect}
                          isCurrentPage={page.id === currentPageId}
                        />
                      )}
                    </Box>
                  ))}
                  <GridItem>
                    <Button colorPalette="secondary" w="100%" onClick={() => handleAddPage()}>
                      +
                    </Button>
                  </GridItem>
                </Flex>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <DeleteConfirmation
        open={deleteConfirmationOpen}
        setOpen={setDeleteConfirmationOpen}
        handlePageDelete={() => handlePageDelete(deletedPage)}
      />
    </>
  );
};

export default PageSelector;
