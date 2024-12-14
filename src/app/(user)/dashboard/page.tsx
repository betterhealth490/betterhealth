"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import PatientDashboard from "./PatientDashboard";
import TherapistDashboard from "./TherapistDashboard";

const Dashboard: React.FC = () => {
  const { user } = useUser();

  // Fetch role from Clerk metadata
  const role = (user?.unsafeMetadata as any)?.role;

  // Render the respective dashboard based on the user's role
  if (role === "therapist") {
    return <TherapistDashboard />;
  } else {
    return <PatientDashboard />;
  }
};

export default Dashboard;
