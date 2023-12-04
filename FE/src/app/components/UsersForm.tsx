import { Box, TextField, FormControl, MenuItem, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RolesType } from "../types/RolesType";
import { useFormik } from "formik";
import { UsersType } from "../types/UsersType";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";

// Users Form is dynamic form both for editing existing and creating new users, regarding the paramID

const UsersForm = ({ paramID }: any) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<UsersType>({
    firstName: "",
    lastName: "",
    email: "",
    roleName: "",
    createdAt: "",
  });
  const [roles, setRoles] = useState<RolesType[]>([]);

  const fetchRoles = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/roles`);
    const roles: RolesType[] = await response.json();
    const uniqueRoleNames = new Set();
    // filter duplicate role names
    const uniqueRoles = roles.filter((item) => {
      if (!uniqueRoleNames.has(item.roleName)) {
        uniqueRoleNames.add(item.roleName);
        return true;
      }
      return false;
    });

    setRoles(uniqueRoles);
  };

  const fetchUser = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/${paramID}`
    );
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
  };

  useEffect(() => {
    fetchRoles();
    if (paramID) {
      fetchUser();
    }
  }, []);

  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required("Name is required")
      .matches(/^[A-Za-z]+$/, "Only letters are allowed for the First Name")
      .min(2)
      .max(20),
    lastName: yup
      .string()
      .required("Name is required")
      .matches(/^[A-Za-z]+$/, "Only letters are allowed for the Last Name")
      .min(2)
      .max(20),
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
    roleName: yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: user,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values: UsersType) => {
      try {
        setLoading(true);
        const userData: UsersType = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roleName: values.roleName,
          createdAt: new Date().toString(),
        };
        setTimeout(async () => {
          const data = await fetch(
            paramID
              ? `${process.env.NEXT_PUBLIC_API}/users/${paramID}`
              : `${process.env.NEXT_PUBLIC_API}/users`,
            {
              method: paramID ? "PUT" : "POST",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (data.status >= 200) {
            router.push("/Users");
          }
          setLoading(false);
        }, 2000);
      } catch (error) {
        setLoading(false);
        throw new Error("User creation failed");
      }
    },
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        style={{
          margin: "2rem auto",
          maxWidth: "30rem",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <TextField
          name="firstName"
          label="First Name"
          variant="outlined"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />

        <TextField
          name="lastName"
          label="Last Name"
          variant="outlined"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          value={formik.values.email}
        />
        <FormControl fullWidth>
          <TextField
            select
            name="roleName"
            label="Role"
            value={formik.values.roleName}
            onChange={formik.handleChange}
            error={formik.touched.roleName && Boolean(formik.errors.roleName)}
            helperText={formik.touched.roleName && formik.errors.roleName}
          >
            {roles.map((role: RolesType, index: number) => (
              <MenuItem key={index} value={role.roleName}>
                {role.roleName}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <LoadingButton
          size="small"
          type="submit"
          loading={isLoading}
          variant="contained"
        >
          <span>{paramID ? "Update" : "Create"}</span>
        </LoadingButton>
      </Box>
    </>
  );
};

export default UsersForm;
