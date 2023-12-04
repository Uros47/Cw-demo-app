import { AppBar, Box, MenuItem, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <AppBar position="relative">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link style={{ textDecoration: "none", color: "white" }} href="/">
          <Typography variant="h6">CW Demo</Typography>
        </Link>
        <Box sx={{ display: "flex" }}>
          <MenuItem component={Link} href="/Roles">
            <Typography textAlign="center">Roles</Typography>
          </MenuItem>
          <MenuItem component={Link} href="/Users">
            <Typography textAlign="center">Users</Typography>
          </MenuItem>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
