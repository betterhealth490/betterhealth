"use server";

import {
  createAppointment,
  getApprovedTherapistsByPatient,
  getTherapistAvailability,
  updateAppointmentStatus,
  ListAppointmentInput,
  UpdateAppointmentStatusInput,
  listAppointmentsByTherapist
} from "~/data-access/appointment";

import { db } from "~/db";
import { users, appointments } from "~/db/schema";
import { eq } from "drizzle-orm";
import { type CreateAppointmentInput } from "~/entities/appointment";
import { Appointment } from "~/data-access/appointment";


export async function createAppointmentAction(input: CreateAppointmentInput) {
  return await createAppointment(input);
}

export async function listApprovedTherapistsAction(patientId: number) {
  return await getApprovedTherapistsByPatient(patientId);
}

export async function listAppointmentsAction(patientId: number) {
  try {
    const result = await db
      .select({
        appointmentId: appointments.appointmentId,
        appointmentDate: appointments.appointmentDate,
        therapistId: appointments.therapistId,
        notes: appointments.notes,
        status: appointments.status,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.therapistId, users.userId))
      .where(eq(appointments.patientId, patientId));

    return result.map((appointment) => ({
      appointmentId: appointment.appointmentId,
      appointmentDate: appointment.appointmentDate,
      therapistName: `${appointment.firstName || "Unknown"} ${appointment.lastName || "Therapist"}`,
      notes: appointment.notes || "No notes provided",
      status: appointment.status || "pending",
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to retrieve appointments");
  }
}

export async function getApprovedTherapistsForPatientAction(patientId: number) {
  try {
    const therapists = await getApprovedTherapistsByPatient(patientId);
    return therapists.map((therapist) => {
      const nameParts = therapist.name?.split(" ") || ["Unknown"];
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.slice(1).join(" ") || "Unknown";

      return {
        therapistId: therapist.therapistId,
        firstName: firstName,
        lastName: lastName,
      };
    });
  } catch (error) {
    console.error("Error fetching approved therapists:", error);
    throw new Error("Failed to fetch therapists.");
  }
}

export async function getTherapistAvailabilityAction(input: {
  therapistId: number;
  day: number;
}) {
  try {
    const availability = await getTherapistAvailability(input);
    return availability;
  } catch (error) {
    console.error("Error fetching therapist availability:", error);
    throw new Error("Failed to fetch availability for the therapist.");
  }
}

export async function listAppointmentsByTherapistAction(therapistId: number) {
    const result = await listAppointmentsByTherapist(therapistId);
    return result.map((appointment) => ({
      appointmentId: appointment.appointmentId,
      appointmentDate: appointment.appointmentDate,
      notes: appointment.notes,
      status: appointment.status,
      patientName: appointment.patientName,
    }));
  }

export async function updateAppointmentStatusAction(
    input: UpdateAppointmentStatusInput
  ): Promise<Appointment | null> {
    try {
      const result = await updateAppointmentStatus(input); 
  
      console.log("Appointment updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }
  
