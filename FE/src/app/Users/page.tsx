"use client";
import React, { useEffect, useState } from "react";
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
  const [users, setUsers] = useState<UsersType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<string>("Date of creation");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchUsersData = async () => {
    setIsLoading(true);
    try {
      const queryParams = `?_page=${
        currentPage + 1
      }&_limit=${rowsPerPage}&_sort=${
        sortColumn === "Date of creation" ? "createdAt" : sortColumn
      }&_order=${sortOrder}`;

      const users = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users` + queryParams,
        {
          method: "GET",
        }
      );
      const totalCountHeader = users.headers.get("X-Total-Count");
      const totalCountValue = totalCountHeader
        ? parseInt(totalCountHeader, 10)
        : 0;

      const data = await users.json();
      setUsers(data);
      setTotalCount(totalCountValue);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error("Error fetching data:", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  useEffect(() => {
    fetchUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, sortOrder, sortColumn]);

  const handleSortRequest = (column: string) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  if (users.length === 0) {
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
            {users.map((item: UsersType) => (
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
