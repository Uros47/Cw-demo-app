import { Box, CircularProgress } from "@mui/material";
import React from "react";

export default function loading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
