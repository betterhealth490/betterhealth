"use client";

import CreateBillForm from "./createBill";
import { listBillsByTherapistAction } from "./actions";
import { useState, useEffect } from "react";

interface BillingRecord {
  billId: number;
  patientId: number;
  firstName: string;
  lastName: string;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid";
  createdAt: Date;
}

export default function TherapistBilling({ therapistId }: { therapistId: number }) {
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchBillings = async () => {
    try {
      const result = await listBillsByTherapistAction(therapistId);
      const normalized = result.map((billing) => ({
        ...billing,
        status: billing.status ?? "pending",
      }));
      setBillings(normalized);
    } catch (error) {
      console.error("Failed to fetch billing records:", error);
      setErrorMessage("Failed to fetch billing records. Please try again.");
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const filteredBillings = selectedPatientId
    ? billings.filter((billing) => billing.patientId === selectedPatientId)
    : billings;

  const handleBillCreated = () => {
    setSuccessMessage("Bill created successfully!");
    fetchBillings();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Manage Billing</h1>
      {successMessage && (
        <div className="mb-6 text-sm text-green-700 bg-green-100 border border-green-300 p-4 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 text-sm text-red-700 bg-red-100 border border-red-300 p-4 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <CreateBillForm therapistId={therapistId} onBillCreated={handleBillCreated} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <label
          htmlFor="patientSelect"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by Patient
        </label>
        <select
          id="patientSelect"
          value={selectedPatientId ?? ""}
          onChange={(e) =>
            setSelectedPatientId(e.target.value === "" ? null : parseInt(e.target.value, 10))
          }
          className="block w-1/3 rounded-lg border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        >
          <option value="">All Patients</option>
          {billings
            .reduce(
              (acc, bill) =>
                acc.find((p) => p.patientId === bill.patientId)
                  ? acc
                  : [...acc, { patientId: bill.patientId, firstName: bill.firstName, lastName: bill.lastName }],
              [] as { patientId: number; firstName: string; lastName: string }[]
            )
            .map((patient) => (
              <option key={patient.patientId} value={patient.patientId}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
        </select>
      </div>

      {/* Billing List */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Billing Records</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                <th className="border px-4 py-3">Patient</th>
                <th className="border px-4 py-3">Amount</th>
                <th className="border px-4 py-3">Due Date</th>
                <th className="border px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBillings.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 py-6"
                  >
                    No billing records found.
                  </td>
                </tr>
              ) : (
                filteredBillings.map((billing) => (
                  <tr key={billing.billId} className="hover:bg-gray-50 transition">
                    <td className="border px-4 py-3">
                      {billing.firstName} {billing.lastName}
                    </td>
                    <td className="border px-4 py-3">${billing.amount.toFixed(2)}</td>
                    <td className="border px-4 py-3">
                      {new Date(billing.dueDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`border px-4 py-3 font-medium ${
                        billing.status === "pending"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {billing.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
