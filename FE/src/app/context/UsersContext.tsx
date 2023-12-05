"use client";
import React, { useContext, useEffect, useOptimistic, useState } from "react";
import { createContext } from "react";
import { UsersType } from "../types/UsersType";

const UsersContext = createContext<any>({} as any);

interface UsersContextProps {
  children: React.ReactNode;
}

export default function useUsersContext() {
  return useContext(UsersContext);
}

export const UserContextProvider = ({ children }: UsersContextProps) => {
  const [user, setUser] = useState<UsersType>({
    firstName: "",
    lastName: "",
    email: "",
    roleName: "",
    createdAt: "",
  });
  const [users, setUsers] = useState<UsersType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortColumn, setSortColumn] = useState<string>("Date of creation");
  const [optimisiticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, newUser: UsersType) => {
      return [...state, newUser];
    }
  );

  const handleSortRequest = (column: string) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const fetchUserById = async ({ paramID }: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/${paramID}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong, request failed");
      }
      const userData: UsersType = await response.json();
      if (paramID) {
        setUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          roleName: userData.roleName,
          createdAt: userData.createdAt,
        });
      }
    } catch (error: any) {
      throw new Error("Something went wrong:", error);
    }
  };

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

  return (
    <UsersContext.Provider
      value={{
        user,
        users,
        setUser,
        isLoading,
        fetchUserById,
        optimisiticUsers,
        setOptimisticUsers,
        fetchUsersData,
        handleChangePage,
        handleChangeRowsPerPage,
        currentPage,
        rowsPerPage,
        totalCount,
        handleSortRequest,
        setSortOrder,
        setSortColumn,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
