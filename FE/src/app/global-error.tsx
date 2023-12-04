"use client";

import { Button, Typography } from "@mui/material";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Typography variant="h4">Something went wrong!</Typography>
        <Button variant="text" onClick={() => reset()}>
          Try again
        </Button>
      </body>
    </html>
  );
}
