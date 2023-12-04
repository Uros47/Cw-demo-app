"use client";

import RolesForm from "@/app/components/RolesForm";
import { useParams } from "next/navigation";
import React from "react";

const RoleEditFormPage: React.FC<{}> = () => {
  const { id } = useParams();
  return <RolesForm paramID={id} />;
};

export default RoleEditFormPage;
