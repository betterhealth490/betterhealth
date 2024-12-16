"use client";

import { useEffect, useState } from "react";
import { listAppointmentsAction } from "./actions";

interface Appointment {
  appointmentId: number;
  appointmentDate: Date;
  therapistName: string;
  notes: string;
  status: string;
}

export default function AppointmentsList({
  patientId,
  refresh,
}: {
  patientId: number;
  refresh: boolean;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<string>("all"); 
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const result = await listAppointmentsAction(patientId);
      setAppointments(result);
      setFilteredAppointments(result); 
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setErrorMessage("Failed to fetch appointments. Please try again later.");
    }
  };

  const handleFilterChange = (therapistName: string) => {
    setFilter(therapistName);
    if (therapistName === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((appointment) =>
          appointment.therapistName.toLowerCase().includes(therapistName.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [patientId, refresh]);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Appointments</h2>

      {errorMessage && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Therapist
        </label>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
        >
          <option value="all">All Therapists</option>
          {Array.from(new Set(appointments.map((a) => a.therapistName))).map(
            (therapistName) => (
              <option key={therapistName} value={therapistName}>
                {therapistName}
              </option>
            )
          )}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#7C3AED] text-white uppercase">
            <tr>
              <th className="px-6 py-3 border">Date</th>
              <th className="px-6 py-3 border">Therapist</th>
              <th className="px-6 py-3 border">Notes</th>
              <th className="px-6 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.appointmentId}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="px-6 py-4 border">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 border">{appointment.therapistName}</td>
                  <td className="px-6 py-4 border">{appointment.notes}</td>
                  <td
                    className={`px-6 py-4 border capitalize ${
                      appointment.status === "approved"
                        ? "text-green-600"
                        : appointment.status === "declined"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {appointment.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
