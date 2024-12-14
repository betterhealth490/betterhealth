"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const BillingDashboard: React.FC = () => {
  const { user } = useUser();
  const [bills, setBills] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const role = (user?.unsafeMetadata as any)?.role;

  const fetchBills = async () => {
    try {
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      if (isNaN(therapistId)) {
        setMessage("Invalid therapist ID");
        return;
      }
  
      // Fetch bills for all patients associated with the therapist
      const response = await fetch(`http://127.0.0.1:5000/billing/therapist/${therapistId}`);
      if (response.ok) {
        const data = await response.json();
        setBills(data); // Update the state with all relevant bills
      } else {
        setMessage("Failed to fetch bills.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching bills.");
      console.error(error);
    }
  };
  

  const fetchPatients = async () => {
    try {
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      if (isNaN(therapistId)) {
        setMessage("Invalid therapist ID.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:5000/therapist_patient_list/${therapistId}`);
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        setMessage("Failed to fetch patients.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching patients.");
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

  const createBill = async () => {
    try {
      if (!selectedPatientId || !amount || !dueDate) {
        setMessage("Please select a patient, enter an amount, and set a due date.");
        return;
      }
  
      const therapistId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);
      if (isNaN(therapistId)) {
        setMessage("Invalid therapist ID.");
        return;
      }
  
      const response = await fetch("http://127.0.0.1:5000/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: selectedPatientId, // Patient's user ID
          therapist_id: therapistId,    // Therapist's user ID
          amount,
          due_date: dueDate,
        }),
      });
  
      if (response.ok) {
        setMessage("Bill created successfully!");
        fetchBills(); // Refresh the list of bills
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred while creating the bill.");
      console.error(error);
    }
  };
  
  
  

  useEffect(() => {
    if (role === "therapist") {
      fetchPatients();
    }
    fetchBills();
  }, [role]);

  return (
      <div style={styles.container}>
        {role === "therapist" && (
          <div style={styles.formContainer}>
            <h3 style={styles.formTitle}>Create a Bill</h3>
            <select
              style={styles.input}
              value={selectedPatientId || ""}
              onChange={(e) => setSelectedPatientId(parseInt(e.target.value, 10))}
            >
              <option value="">Select a Patient</option>
              {patients.map((patient) => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              style={styles.input}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
            <input
              type="date"
              style={styles.input}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button style={styles.createButton} onClick={createBill}>
              Create Bill
            </button>
          </div>
        )}

        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>Invoices</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Patient Name</th>
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
                    {bill.first_name} {bill.last_name}
                  </td>
                  <td style={styles.tableCell}>${bill.amount.toFixed(2)}</td>
                  <td style={styles.tableCell}>{bill.status}</td>
                  <td style={styles.tableCell}>
                    {new Date(bill.due_date).toLocaleDateString()}
                  </td>
                  <td style={styles.tableCell}>
                    {bill.status === "pending" && role === "patient" && (
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
        </div>

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
    display: "flex",
    flexDirection: "column" as "column",
    gap: "20px",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  formContainer: {
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tableContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  tableTitle: {
    fontSize: "18px",
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
    backgroundColor: "#e7f5e7",
    color: "#2f662f",
    padding: "10px",
    borderRadius: "5px",
    marginTop: "20px",
  },
  closeMessageButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default BillingDashboard;
