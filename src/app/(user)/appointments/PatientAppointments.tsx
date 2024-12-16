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

export default function PatientAppointments({ patientId }: { patientId: number }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [time, setTime] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [refreshAppointments, setRefreshAppointments] = useState<boolean>(false);

  const generateDefaultTimeSlots = (): string[] => {
    const slots: string[] = [];
    let currentHours = 9;
    let currentMinutes = 0;

    while (currentHours < 20 || (currentHours === 20 && currentMinutes < 30)) {
      slots.push(
        `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`
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
          setErrorMessage("Please select a valid date and time before submitting.");
          return;
        }
      
        const appointmentDate = new Date(selectedDate);
      
        const [hours, minutes] = time.split(":").map((value) => {
          const num = Number(value);
          return isNaN(num) ? undefined : num;
        });

        if (hours === undefined || minutes === undefined) {
          setErrorMessage("Invalid time format. Please select a valid time slot.");
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
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <div className="flex h-2/3">
        <div className="w-1/3 p-6">
          <AppointmentCalendar date={selectedDate} setDate={setSelectedDate} />
        </div>
        <div className="w-2/3 p-6 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Book an Appointment</h1>
          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Date</label>
              <input
                type="text"
                readOnly
                value={selectedDate ? selectedDate.toDateString() : "No date selected"}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
              <select
                value={selectedTherapist ?? ""}
                onChange={(e) => setSelectedTherapist(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
              >
                <option value="" disabled>
                  Select a Therapist
                </option>
                {therapists.map((therapist) => (
                  <option key={therapist.therapistId} value={therapist.therapistId}>
                    {therapist.firstName} {therapist.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
              >
                <option value="" disabled>
                  {availableSlots.length > 0 ? "Select a Time Slot" : "No slots available"}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <p className="w-full px-4 py-2 border bg-gray-50 rounded-md">30 Minutes</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
              placeholder="Enter notes..."
            />
          </div>

          <div className="flex justify-end">
            <button
              className="bg-[#7C3AED] text-white px-6 py-2 rounded-lg hover:bg-[#6A2BC6] transition duration-200"
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