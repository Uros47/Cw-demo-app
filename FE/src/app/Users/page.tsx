"use client";
import React from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import { UsersType } from "../types/UsersType";
import { format } from "date-fns";
import useUsersContext from "../context/UsersContext";

const cellTitles = [
  "Id",
  "First Name",
  "Last Name",
  "Email",
  "Role",
  "Date of creation",
  "Edit",
];

export default function Users() {
  const router = useRouter();

  const {
    users,
    handleChangePage,
    handleChangeRowsPerPage,
    currentPage,
    rowsPerPage,
    totalCount,
    sortOrder,
    sortColumn,
    handleSortRequest,
  } = useUsersContext();

  if (users?.length === 0) {
    return (
      <Box textAlign="center">
        <Typography variant="h4" textAlign="center">
          No data to display.
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: "1rem" }}
          href="/Users/Form"
        >
          Create New
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        margin: "0 auto",
        maxWidth: "60%",
        minWidth: "40rem",
      }}
    >
      <Typography sx={{ marginBottom: "2rem" }} variant="h4" align="left">
        Users
      </Typography>
      <TableContainer
        sx={{
          height: "30rem",
        }}
        component={Paper}
      >
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {cellTitles.map((title: string, index: number) => (
                <TableCell
                  sx={{ fontWeight: 600 }}
                  key={index}
                  sortDirection={sortColumn === title ? sortOrder : false}
                >
                  {title !== "Date of creation" ? (
                    title
                  ) : (
                    <TableSortLabel
                      active={sortColumn === "Date of creation"}
                      direction={sortOrder}
                      onClick={() => handleSortRequest("Date of creation")}
                    >
                      {title}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((item: UsersType) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.roleName}</TableCell>
                <TableCell>
                  {format(new Date(item.createdAt), "dd-MM-yyyy 'at' h:mm a")}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      onClick={() => router.push(`/Users/Form/${item.id}`)}
                      aria-label="edit"
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Button variant="contained" sx={{ marginTop: "1rem" }} href="/Users/Form">
        Create New User
      </Button>
    </Box>
  );
}
