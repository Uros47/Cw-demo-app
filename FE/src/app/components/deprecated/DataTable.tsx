"use client";
import {
  Box,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TableProps {
  title?: string;
  cellTitles: string[];
  data: any[];
}

function DataTable({ title, cellTitles, data }: TableProps) {
  const [openDailog, setOpenDialog] = useState<boolean>(false);

  const router = useRouter();

  const cellData = Object.keys(data[0]);
  console.log(cellData, "table ");

  const handleChangePage = () => {};
  const handleChangeRowsPerPage = () => {};

  return (
    <>
      <Box>
        <Typography sx={{ marginBottom: "2rem" }} variant="h4" align="left">
          {title}
        </Typography>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {cellTitles
                  ? cellTitles.map((title: string, index: number) => (
                      <TableCell sx={{ fontWeight: 600 }} key={index}>
                        {title}
                      </TableCell>
                    ))
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                ? data.map((item: any) => (
                    <TableRow key={item.id}>
                      {cellData.map((info, index) => (
                        <TableCell key={index}>{item[info]}</TableCell>
                      ))}
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <IconButton
                            onClick={() => router.push(`/Users/form${item.id}`)}
                            aria-label="edit"
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setOpenDialog(true);
                            }}
                            aria-label="delete"
                          >
                            <DeleteIcon color="warning" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30, 50]}
            component="div"
            count={
              1
              //total
            }
            rowsPerPage={
              10
              //rowsPerPage
            }
            page={
              0
              //currentPage
            }
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* {openDailog ? (
        <ConfirmationDialog
          open={openDailog}
          handleClose={() => setOpenDialog(false)}
          dialogTitle="Delete User"
          dialogContentText="Are you sure you want to delete selected Account?"
          onDelete={() => {
            setOpenDialog(false);
            deleteUser();
          }}
          loading={loading}
          confirmationText={"Yes"}
        />
      ) : null} */}
    </>
  );
}

export default DataTable;
