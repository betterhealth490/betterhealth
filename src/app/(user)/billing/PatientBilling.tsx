"use client";

import { useState, useEffect } from "react";
import {
  listBillingsAction,
  updateBillingAction,
  getTherapistNameByBillIdAction,
} from "./actions";

interface BillingRecord {
  billId: number;
  amount: number;
  dueDate: Date;
  status: "pending" | "paid";
  updatedAt: Date;
  therapistName: string;
}

export default function PatientBilling({ patientId }: { patientId: number }) {
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const billingList = await listBillingsAction(patientId);

      const normalizedBillings = await Promise.all(
        billingList.map(async (billing) => {
          const therapistName = await getTherapistNameByBillIdAction(billing.billId);
          return {
            ...billing,
            status: billing.status ?? "pending",
            therapistName: therapistName || "Unknown Therapist",
          };
        })
      );

      setBillings(normalizedBillings);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching billings:", error);
      setErrorMessage("Failed to load billing records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (billId: number) => {
    try {
      const originalBill = billings.find((billing) => billing.billId === billId);
      if (!originalBill) throw new Error("Bill not found");
  
      await updateBillingAction(billId, patientId, originalBill.amount, "paid");
  
      setSuccessMessage("Payment successful!");
      fetchBillings();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to update billing status:", error);
      setErrorMessage("Payment failed. Please try again.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };
  

  const filteredBillings = billings.filter((billing) =>
    filter === "all" ? true : billing.status === filter
  );

  useEffect(() => {
    fetchBillings();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Billing Overview</h1>

      {successMessage && (
        <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-300 p-3 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-700 font-medium">Filter by status:</p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "pending" | "paid")}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center animate-pulse">Loading bills...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-[#7C3AED] text-white uppercase">
                <tr>
                  <th className="px-6 py-3 border">Therapist</th>
                  <th className="px-6 py-3 border">Amount</th>
                  <th className="px-6 py-3 border">Due Date</th>
                  <th className="px-6 py-3 border">Status</th>
                  <th className="px-6 py-3 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBillings.map((billing) => (
                  <tr
                    key={billing.billId}
                    className={`border-b ${
                      new Date(billing.dueDate) < new Date() && billing.status === "pending"
                        ? "bg-red-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <td className="px-6 py-4 border">{billing.therapistName}</td>
                    <td className="px-6 py-4 border font-semibold">
                      ${billing.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 border">
                      {new Date(billing.dueDate).toLocaleDateString()}
                    </td>
                    <td
                      className={`px-6 py-4 border capitalize ${
                        billing.status === "paid" ? "text-green-600 font-bold" : "text-yellow-600"
                      }`}
                    >
                      {billing.status}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {billing.status === "pending" ? (
                        <button
                          onClick={() => handlePayNow(billing.billId)}
                          className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-4 rounded-lg transition duration-200 ease-in-out"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span className="text-green-500 font-semibold">Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBillings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
