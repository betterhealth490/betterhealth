"use client";

import { useEffect, useState } from "react";
import { AppointmentCalendar } from "~/app/(user)/appointments/appointment-calendar";
import {
  listAppointmentsAction,
  getApprovedTherapistsForPatientAction,
  createAppointmentAction,
} from "./actions";
import AppointmentsList from "./AppointmentsList";

interface Therapist {
  therapistId: number;
  firstName: string;
  lastName: string;
}

interface Appointment {
  appointmentId: number;
  appointmentDate: Date;
  notes: string;
  status: string;
}

export default function PatientAppointments({
  patientId,
}: {
  patientId: number;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(
    null,
  );
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshAppointments, setRefreshAppointments] =
    useState<boolean>(false);

  const generateDefaultTimeSlots = (): string[] => {
    const slots: string[] = [];
    let currentHours = 9;
    let currentMinutes = 0;

    while (currentHours < 20 || (currentHours === 20 && currentMinutes < 30)) {
      slots.push(
        `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`,
      );
      currentMinutes += 30;
      if (currentMinutes >= 60) {
        currentHours++;
        currentMinutes -= 60;
      }
    }

    return slots;
  };

  const handleSubmitAppointment = async () => {
    if (!selectedDate || !selectedTherapist || !time) {
      setErrorMessage("Please complete all fields before submitting.");
      return;
    }

    try {
      if (!selectedDate || !time) {
        setErrorMessage(
          "Please select a valid date and time before submitting.",
        );
        return;
      }

      if (
        new Date(selectedDate.toDateString()) <=
        new Date(new Date().toDateString())
      ) {
        setErrorMessage("Please select a date later than today.");
        return;
      }
      const appointmentDate = new Date(selectedDate);

      const [hours, minutes] = time.split(":").map((value) => {
        const num = Number(value);
        return isNaN(num) ? undefined : num;
      });

      if (hours === undefined || minutes === undefined) {
        setErrorMessage(
          "Invalid time format. Please select a valid time slot.",
        );
        return;
      }

      appointmentDate.setHours(hours, minutes);

      await createAppointmentAction({
        patientId,
        therapistId: selectedTherapist!,
        appointmentDate,
        notes: notes || "No additional notes provided.",
      });

      setSuccessMessage("Appointment request submitted successfully!");
      setErrorMessage(null);
      setSelectedDate(undefined);
      setSelectedTherapist(null);
      setNotes("");
      setTime("");
      setRefreshAppointments((prev) => !prev);
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setErrorMessage("Failed to submit appointment. Please try again.");
    }
  };

  const fetchTherapists = async () => {
    try {
      const result = await getApprovedTherapistsForPatientAction(patientId);
      setTherapists(result);
      setAvailableSlots(generateDefaultTimeSlots());
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setErrorMessage("Failed to fetch therapists. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex h-2/3">
        <div className="w-1/3 p-6">
          <AppointmentCalendar date={selectedDate} setDate={setSelectedDate} />
        </div>
        <div className="w-2/3 rounded-md bg-white p-6 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            Book an Appointment
          </h1>
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-300 bg-green-100 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Selected Date
              </label>
              <input
                type="text"
                readOnly
                value={
                  selectedDate
                    ? selectedDate.toDateString()
                    : "No date selected"
                }
                className="w-full rounded-md border bg-gray-100 px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Therapist
              </label>
              <select
                value={selectedTherapist ?? ""}
                onChange={(e) => setSelectedTherapist(Number(e.target.value))}
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                <option value="" disabled>
                  Select a Therapist
                </option>
                {therapists.map((therapist) => (
                  <option
                    key={therapist.therapistId}
                    value={therapist.therapistId}
                  >
                    {therapist.firstName} {therapist.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              >
                <option value="" disabled>
                  {availableSlots.length > 0
                    ? "Select a Time Slot"
                    : "No slots available"}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Duration
              </label>
              <p className="w-full rounded-md border bg-gray-50 px-4 py-2">
                30 Minutes
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="Enter notes..."
            />
          </div>

          <div className="flex justify-end">
            <button
              className="rounded-lg bg-[#7C3AED] px-6 py-2 text-white transition duration-200 hover:bg-[#6A2BC6]"
              onClick={handleSubmitAppointment}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <AppointmentsList patientId={patientId} refresh={refreshAppointments} />
      </div>
    </div>
  );
}
