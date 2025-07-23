import "@mdxeditor/editor/style.css";
import React, { useState } from "react";
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  InsertImage,
  imagePlugin,
  ListsToggle,
  listsPlugin,
  Separator,
  BlockTypeSelect,
  headingsPlugin,
} from "@mdxeditor/editor";

import { Box, Paper, Typography } from "@mui/material";

export default function BlogEditor({ content, setContent }) {
  const imageUploadHandler = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Blog Content
      </Typography>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <MDXEditor
          onChange={setContent}
          markdown={content}
          className="min-h-[300px] w-full"
          plugins={[
            diffSourcePlugin({ viewMode: "rich-text" }),
            imagePlugin({ imageUploadHandler }),
            listsPlugin(),
            headingsPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <Separator />
                  <InsertImage />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <BlockTypeSelect />
                </DiffSourceToggleWrapper>
              ),
            }),
          ]}
        />
      </Paper>
    </Box>
  );
}
