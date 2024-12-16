"use client";

import { useEffect, useState } from "react";
import { listAppointmentsForTherapistAction } from "./actions";

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  patientName: string;
  notes: string;
}

export default function TherapistAppointments({ therapistId }: { therapistId: number }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const result = await listAppointmentsForTherapistAction(therapistId);
      setAppointments(result);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Failed to load appointments.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Appointments</h1>

      {errorMessage && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{errorMessage}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-[#7C3AED] text-white uppercase">
            <tr>
              <th className="px-4 py-3 border">Patient</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.appointmentId} className="hover:bg-gray-100">
                <td className="px-4 py-3 border">{appt.patientName}</td>
                <td className="px-4 py-3 border">
                  {new Date(appt.appointmentDate).toLocaleString()}
                </td>
                <td className="px-4 py-3 border">{appt.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
