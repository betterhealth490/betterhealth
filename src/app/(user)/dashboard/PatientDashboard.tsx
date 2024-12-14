"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useUser } from "@clerk/nextjs";
import { PageWrapper } from "~/app/(user)/page-wrapper";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  TooltipItem,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PatientDashboard: React.FC = () => {
  const { user } = useUser();
  const [therapists, setTherapists] = useState<any[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [showTherapists, setShowTherapists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTherapistId, setSelectedTherapistId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const patientId = parseInt((user?.unsafeMetadata as any)?.databaseId, 10);

  const fetchTherapists = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/therapists");
      if (response.ok) {
        const data = await response.json();
        setTherapists(data);
        setFilteredTherapists(data);

        // Fetch the selected therapist for the patient
        const selectedResponse = await fetch(
          `http://127.0.0.1:5000/therapist_patient/${user?.unsafeMetadata?.databaseId}`
        );
        if (selectedResponse.ok) {
          const selectedData = await selectedResponse.json();
          setSelectedTherapistId(selectedData?.therapist_id || null);
        }

        setShowTherapists(true);
      } else {
        setMessage("Failed to fetch therapists.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred while fetching therapists.");
      console.error("Fetch Therapists Error:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredTherapists(
      therapists.filter(
        (therapist) =>
          therapist.first_name.toLowerCase().includes(searchValue) ||
          therapist.last_name.toLowerCase().includes(searchValue) ||
          therapist.email.toLowerCase().includes(searchValue) ||
          therapist.specialty.toLowerCase().includes(searchValue)
      )
    );
  };

  const selectTherapist = async (therapistId: number) => {
    try {
      if (isNaN(patientId)) {
        setMessage("Error: Invalid patient ID.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/therapist_patient_relationship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          therapist_id: therapistId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || "Therapist selected successfully!");
        setSelectedTherapistId(therapistId);

        setTherapists((prevTherapists) =>
          prevTherapists.map((therapist) =>
            therapist.user_id === therapistId
              ? { ...therapist, selected: true }
              : { ...therapist, selected: false }
          )
        );
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error || "Failed to select therapist."}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred while selecting the therapist.");
      console.error("Error selecting therapist:", error);
    }
  };

  const renderTherapists = () => (
    <div style={styles.therapistGrid}>
      {filteredTherapists.map((therapist) => (
        <div key={therapist.user_id} style={styles.therapistCard}>
          <h3>{`${therapist.first_name} ${therapist.last_name}`}</h3>
          <p>Specialty: {therapist.specialty}</p>
          <p>Email: {therapist.email}</p>

          <button
            style={styles.selectButton}
            onClick={() => selectTherapist(therapist.user_id)}
            disabled={therapist.user_id === selectedTherapistId}
          >
            {therapist.user_id === selectedTherapistId ? "Selected" : "Select Therapist"}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <PageWrapper>
      <div>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
          onClick={fetchTherapists}
        >
          Show Therapists
        </button>
      </div>

      {showTherapists && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <input
              type="text"
              placeholder="Search Therapists..."
              value={searchTerm}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            {renderTherapists()}
            <button style={styles.closeButton} onClick={() => setShowTherapists(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxHeight: "90%",
    overflowY: "auto" as "auto",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  therapistGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  therapistCard: {
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as "center",
  },
  selectButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#7F56D9",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#E74C3C",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PatientDashboard;
