"use client";
import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box textAlign="center">
      <Typography variant="h4">Something went wrong!</Typography>
      <Button variant="text" onClick={() => reset()}>
        Try again
      </Button>
    </Box>
  );
}
