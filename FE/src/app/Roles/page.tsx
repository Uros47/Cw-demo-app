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
  TableSortLabel,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { RolesType } from "../types/RolesType";
import Link from "next/link";

const cellTitles = ["Id", "Role Name", "Description", "Edit"];

export default function Roles() {
  const [roles, setRoles] = useState<RolesType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<string>("Role Name");
  const router = useRouter();

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleSortRequest = (column: string) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const fetchRolesData = async () => {
    try {
      const queryParams = `?_page=${
        currentPage + 1
      }&_limit=${rowsPerPage}&_sort=${
        sortColumn === "Role Name" ? "roleName" : sortColumn
      }&_order=${sortOrder}`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/roles` + queryParams,
        {
          method: "GET",
        }
      );

      const totalCountHeader = response.headers.get("X-Total-Count");
      const totalCountValue = totalCountHeader
        ? parseInt(totalCountHeader, 10)
        : 0;

      const data: RolesType[] = await response.json();
      const uniqueRoleNames = new Set();
      const uniqueRoles = data.filter((item) => {
        if (!uniqueRoleNames.has(item.roleName)) {
          uniqueRoleNames.add(item.roleName);
          return true;
        }
        return false;
      });

      setRoles(uniqueRoles);

      setTotalCount(totalCountValue);
    } catch (error: any) {
      throw new Error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchRolesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, sortOrder, sortColumn]);

  if (roles.length === 0) {
    return (
      <Box textAlign="center">
        <Typography variant="h4" textAlign="center">
          No data to display.
        </Typography>
        <Button
          variant="contained"
          sx={{ marginTop: "1rem" }}
          href="/Roles/Form"
        >
          Create New
        </Button>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        height: "auto",
        margin: "0 auto",
        maxWidth: "60%",
        minWidth: "40rem",
      }}
    >
      <Typography sx={{ marginBottom: "2rem" }} variant="h4" align="left">
        Roles
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              {cellTitles.length > 0
                ? cellTitles.map((title: string, index: number) => (
                    <TableCell
                      sx={{ fontWeight: 600 }}
                      key={index}
                      sortDirection={sortColumn === title ? sortOrder : false}
                    >
                      {title !== "Role Name" ? (
                        title
                      ) : (
                        <TableSortLabel
                          active={sortColumn === "Role Name"}
                          direction={sortOrder}
                          onClick={() => handleSortRequest("Role Name")}
                        >
                          {title}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))
                : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.roleName}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    <IconButton
                      onClick={() => router.push(`/Roles/Form/${item.id}`)}
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
      <Link href="/Roles/Form">
        <Button variant="contained" sx={{ marginTop: "1rem" }}>
          Create New Role
        </Button>
      </Link>
    </Box>
  );
}
