"use client";

import { useEffect, useState } from "react";
import {
  listAppointmentsByTherapistAction,
  updateAppointmentStatusAction,
} from "./actions";
import { Button } from "~/components/ui/button";

interface Appointment {
  appointmentId: number;
  appointmentDate: string; // Use ISO string for compatibility
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  patientName: string; // Patient's full name
}

export default function TherapistAppointmentsPage({ therapistId }: { therapistId: number }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const result = await listAppointmentsByTherapistAction(therapistId);
      const formattedResult = result.map((appointment) => ({
        ...appointment,
        appointmentDate: appointment.appointmentDate.toISOString(),
      }));
      setAppointments(formattedResult);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setErrorMessage("Failed to load appointments. Please try again.");
    }
  };

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    try {
      await updateAppointmentStatusAction({
        appointmentId,
        status: newStatus as "pending" | "confirmed" | "cancelled",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Appointments</h1>
      {errorMessage && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-300 p-3 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#7C3AED] text-white uppercase">
              <tr>
                <th className="px-6 py-3 border">Patient</th>
                <th className="px-6 py-3 border">Date</th>
                <th className="px-6 py-3 border">Time</th>
                <th className="px-6 py-3 border">Status</th>
                <th className="px-6 py-3 border">Notes</th>
                <th className="px-6 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr
                    key={appointment.appointmentId}
                    className={`border-b ${
                      appointment.status === "pending"
                        ? "bg-yellow-50"
                        : appointment.status === "confirmed"
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >
                    <td className="px-6 py-4 border">{appointment.patientName}</td>
                    <td className="px-6 py-4 border">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 border">
                      {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 border capitalize font-semibold">
                      {appointment.status}
                    </td>
                    <td className="px-6 py-4 border">{appointment.notes}</td>
                    <td className="px-6 py-4 border text-center">
                      {appointment.status === "pending" ? (
                        <div className="flex gap-2 justify-center">
                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() =>
                              handleUpdateStatus(appointment.appointmentId, "confirmed")
                            }
                          >
                            Confirm
                          </Button>
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() =>
                              handleUpdateStatus(appointment.appointmentId, "cancelled")
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-500">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
