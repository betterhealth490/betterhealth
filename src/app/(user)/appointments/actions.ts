"use server";

import { createAppointment } from "~/data-access/appointment";
import { db } from "~/db";
import { users, relationships, appointments } from "~/db/schema";
import { eq, and } from "drizzle-orm";

import { type CreateAppointmentInput,
    type GetTherapistAvailabilityInput,
    type GetTherapistAvailabilityResult
        } from "~/entities/appointment";
import { getTherapistAvailability } from "~/data-access/appointment";
  
export async function createAppointmentAction(input: CreateAppointmentInput) {
    return await createAppointment(input);
}
import { getApprovedTherapistsByPatient } from "~/data-access/appointment";

// Fetch therapists approved for the current patient
export async function listApprovedTherapistsAction(patientId: number) {
  return await getApprovedTherapistsByPatient(patientId);
}

export async function listAppointmentsAction(patientId: number) {
    try {
      // Fetch appointments and join with the therapists table to get their names
      const result = await db
        .select({
          appointmentId: appointments.appointmentId,
          appointmentDate: appointments.appointmentDate,
          therapistId: appointments.therapistId,
          notes: appointments.notes,
          status: appointments.status, // Assuming a status column exists in the appointments table
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(appointments)
        .innerJoin(users, eq(appointments.therapistId, users.userId))
        .where(eq(appointments.patientId, patientId));
  
      // Map results and include the therapist's full name
      return result.map((appointment) => ({
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.appointmentDate,
        therapistName: `${appointment.firstName || "Unknown"} ${appointment.lastName || "Therapist"}`,
        notes: appointment.notes || "No notes provided",
        status: appointment.status || "pending", // Default to "pending" if status is null or undefined
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
          firstName: firstName, // Ensure firstName is always a string
          lastName: lastName,   // Ensure lastName is always a string
        };
      });
    } catch (error) {
      console.error("Error fetching approved therapists:", error);
      throw new Error("Failed to fetch therapists.");
    }
  }


    export async function getTherapistAvailabilityAction(
        input: GetTherapistAvailabilityInput
      ): Promise<GetTherapistAvailabilityResult | null> {
        const result = await fetch("/api/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
      
        if (!result.ok) {
          throw new Error("Failed to fetch therapist availability");
        }
      
        return result.json();
      }
      


