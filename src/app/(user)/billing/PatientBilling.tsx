"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const PatientBilling: React.FC = () => {
  const { user } = useUser();
  const [bills, setBills] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const patientId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);


  const fetchBills = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/billing/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setBills(data);
      } else {
        setMessage("No bills found.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching bills.");
      console.error(error);
    }
  };

  const payBill = async (billId: number) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/billing/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill_id: billId }),
      });

      if (response.ok) {
        setMessage("Bill paid successfully!");
        fetchBills();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred while paying the bill.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Invoices</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Therapist Name</th>
            <th style={styles.tableHeader}>Amount</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Due Date</th>
            <th style={styles.tableHeader}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.bill_id}>
              <td style={styles.tableCell}>
                {bill.therapist_name || "Unknown Therapist"}
              </td>
              <td style={styles.tableCell}>${bill.amount.toFixed(2)}</td>
              <td style={styles.tableCell}>{bill.status}</td>
              <td style={styles.tableCell}>
                {new Date(bill.due_date).toLocaleDateString()}
              </td>
              <td style={styles.tableCell}>
                {bill.status === "pending" && (
                  <button
                    style={styles.payButton}
                    onClick={() => payBill(bill.bill_id)}
                  >
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && (
        <div style={styles.message}>
          <p>{message}</p>
          <button
            style={styles.closeMessageButton}
            onClick={() => setMessage(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as "collapse",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    textAlign: "left" as "left",
    fontWeight: "bold",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  payButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    backgroundColor: "#e7f5e7",
    color: "#2f662f",
    padding: "10px",
    borderRadius: "5px",
  },
  closeMessageButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default PatientBilling;
