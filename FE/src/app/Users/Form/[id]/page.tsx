"use client";

import React from "react";

import { useParams } from "next/navigation";
import UsersForm from "../../../components/UsersForm";

const UserEditFormPage: React.FC<{}> = () => {
  const { id } = useParams();

  return (
    <>
      <UsersForm paramID={id} />
    </>
  );
};

export default UserEditFormPage;
