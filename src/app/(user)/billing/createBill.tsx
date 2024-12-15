"use client";

import { useEffect, useState } from "react";
import { createBillForPatientAction, listPatientsByTherapistAction } from "./actions";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

export default function CreateBillForm({
  therapistId,
  onBillCreated,
}: {
  therapistId: number;
  onBillCreated: () => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const result = await listPatientsByTherapistAction(therapistId);
      setPatients(
        result.map((item: any) => ({
          id: item.patientId,
          firstName: item.firstName,
          lastName: item.lastName,
        }))
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
      setErrorMessage("Failed to load patients. Please try again.");
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreateBill = async () => {
    if (!selectedPatient || !amount || !dueDate) {
      setErrorMessage("All fields are required.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await createBillForPatientAction({
        therapistId,
        patientId: selectedPatient,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
      });
      onBillCreated();
      setSelectedPatient(null);
      setAmount("");
      setDueDate("");
    } catch (error) {
      console.error("Error creating bill:", error);
      setErrorMessage("Failed to create the bill. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg mx-auto border border-gray-200 p-4 max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a Bill</h2>

      {errorMessage && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 p-2 rounded-lg">
          {errorMessage}
        </div>
      )}

      {loadingPatients ? (
        <p className="text-center text-gray-500 animate-pulse">Loading patients...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select
              value={selectedPatient ?? ""}
              onChange={(e) => setSelectedPatient(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            >
              <option value="" disabled>
                Select a Patient
              </option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleCreateBill}
          disabled={isSubmitting}
          className={`w-full md:w-auto px-6 py-2 text-white font-medium rounded-md transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#7C3AED] hover:bg-[#6A22C8]"
          }`}
        >
          {isSubmitting ? "Creating Bill..." : "Create Bill"}
        </button>
      </div>
    </div>
  );
}
