import { Box, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RolesType } from "../types/RolesType";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";

// Roles Form is dynamic form both for editing existing and creating new roles, regarding the paramID

const RolesForm = ({ paramID }: any) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [role, setRole] = useState<RolesType>({
    roleName: "",
    description: "",
  });

  const fetchRole = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API}/roles/${paramID}`);
    const roleData: RolesType = await data.json();
    if (paramID) {
      setRole({
        roleName: roleData.roleName,
        description: roleData.description,
      });
    }
  };

  useEffect(() => {
    if (paramID) {
      fetchRole();
    }
  }, []);

  const validationSchema = yup.object({
    roleName: yup
      .string()
      .required("Role name is required")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Role name must be alphanumeric and can contain underscore (_)"
      )
      .min(2, "Role name must be at least 2 characters")
      .max(16, "Role name must not exceed 16 characters"),
    description: yup.string().min(2).max(50),
  });

  const formik = useFormik({
    initialValues: role,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values: RolesType) => {
      try {
        setLoading(true);
        const userData: RolesType = {
          roleName: values.roleName,
          description: values.description,
        };
        setTimeout(async () => {
          const response = await fetch(
            paramID
              ? `${process.env.NEXT_PUBLIC_API}/roles/${paramID}`
              : `${process.env.NEXT_PUBLIC_API}/roles`,
            {
              method: paramID ? "PUT" : "POST",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status >= 200) {
            router.push("/Roles");
          }
          setLoading(false);
        }, 2000);
      } catch (error) {
        setLoading(false);
        throw new Error("Role creation failed");
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
        <Typography sx={{ marginBottom: "2rem" }} variant="h5" align="center">
          {paramID ? "Edit Role" : "Create Role"}
        </Typography>
        <TextField
          name="roleName"
          label="Role Name"
          variant="outlined"
          value={formik.values.roleName}
          onChange={formik.handleChange}
          error={formik.touched.roleName && Boolean(formik.errors.roleName)}
          helperText={formik.touched.roleName && formik.errors.roleName}
        />

        <TextField
          name="description"
          label="Description"
          variant="outlined"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
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

export default RolesForm;
