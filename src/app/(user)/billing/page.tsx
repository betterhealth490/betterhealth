"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { PageWrapper } from "~/app/(user)/page-wrapper";
import TherapistBilling from "./TherapistBilling";
import PatientBilling from "./PatientBilling";

const BillingDashboard: React.FC = () => {
  const { user } = useUser();
  const role = (user?.unsafeMetadata as any)?.role;

  return (
    <PageWrapper
      actions={
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Billing Dashboard</h2>
        </div>
      }
    >
      {role === "therapist" ? <TherapistBilling /> : <PatientBilling />}
    </PageWrapper>
  );
};

export default BillingDashboard;
