import { eq, and, sql } from "drizzle-orm";
import { db } from "~/db";
import { appointments, relationships, users, availability, patients } from "~/db/schema";
import { 
    type GetAppointmentInput, 
    type GetAppointmentResult, 
    type ListAppointmentsInput,
    type ListAppointmentsItem,
    type ListAppointmentsResult,
    type UpdateAppointmentInput,
    type UpdateAppointmentResult,
    type CreateAppointmentInput,
    type CreateAppointmentResult
} from "~/entities/appointment";

export interface Appointment {
    appointmentId: number;
    patientId: number;
    therapistId: number;
    appointmentDate: string | Date;
    status: string; 
    notes: string;
    createdAt: Date;
    updatedAt: Date | null; 
  }

export async function getAppointment(input: GetAppointmentInput): Promise<GetAppointmentResult> {
    const result = await db
        .select()
        .from(appointments)
        .where(
            eq(appointments.appointmentId, input.appointmentId)
        );
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No appointment found")
    }
}

export async function updateAppointment(input: UpdateAppointmentInput): Promise<UpdateAppointmentResult> {
    const result = await db
        .update(appointments)
        .set({
            appointmentId: input.appointmentId,
            appointmentDate: input.appointmentDate,
        })
        .where(
            and(
                eq(appointments.appointmentId, input.appointmentId),
                eq(appointments.appointmentDate, input.appointmentDate)
            )
        )
        .returning();
    
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No appointment found")
    }
}

export async function createAppointment(input: CreateAppointmentInput): Promise<CreateAppointmentResult> {
    const result = await db
        .insert(appointments)
        .values({
            patientId: input.patientId,
            therapistId: input.therapistId,
            appointmentDate: input.appointmentDate,
            notes: input.notes
        })
        .returning();
    
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No appointment found")
    }
}

export async function listAppointments(input: ListAppointmentsInput): Promise<ListAppointmentsResult> {
    const result = await db
        .select({
            appointmentDate: appointments.appointmentDate,
            appointmentId: appointments.appointmentId,
            therapistId: appointments.therapistId,
            patientId: appointments.patientId,
            status: appointments.status, 
        })
        .from(appointments)
        .where(
            and(
                eq(appointments.patientId, input.userId)
            )
        );

    return result;
}


export async function getApprovedTherapistsByPatient(patientId: number) {
    const result = await db
      .select({
        therapistId: relationships.therapistId,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(relationships)
      .innerJoin(users, eq(users.userId, relationships.therapistId))
      .where(
        and(
          eq(relationships.patientId, patientId),
          eq(relationships.status, "approved")
        )
      );

    return result.map((therapist) => ({
      therapistId: therapist.therapistId,
      name: `${therapist.firstName} ${therapist.lastName}`,
    }));
  }


  export interface GetTherapistAvailabilityInput {
    therapistId: number;
    day: number;
  }
  
  export interface GetTherapistAvailabilityResult {
    day: number;
    startTime: string; 
    endTime: string;  
  }
  
  export async function getTherapistAvailability(
    input: GetTherapistAvailabilityInput
  ): Promise<GetTherapistAvailabilityResult | null> {
    const result = await db
      .select({
        day: availability.day,
        startTime: availability.startTime,
        endTime: availability.endTime,
      })
      .from(availability)
      .where(
        and(
          eq(availability.therapistId, input.therapistId),
          eq(availability.day, input.day)
        )
      )
      .limit(1);
  
    return result.at(0) || null;
  }

  export interface ListAppointmentInput {
    therapistId: number;
  }
  
  export interface UpdateAppointmentStatusInput {
    appointmentId: number;
    status: "pending" | "confirmed" | "cancelled";
  }


  export async function listAppointmentsByTherapist(therapistId: number) {
    const result = await db
      .select({
        appointmentId: appointments.appointmentId,
        appointmentDate: appointments.appointmentDate,
        notes: appointments.notes,
        status: appointments.status,
        patientName: sql`${users.firstName} || ' ' || ${users.lastName}`.as<string>(), 
      })
      .from(appointments)
      .innerJoin(patients, eq(appointments.patientId, patients.patientId))
      .innerJoin(users, eq(patients.patientId, users.userId)) 
      .where(eq(appointments.therapistId, therapistId));
  
    return result;
  }
  
  export async function updateAppointmentStatus(
    input: UpdateAppointmentStatusInput
  ): Promise<Appointment | null> {
    const result = await db
      .update(appointments)
      .set({
        status: input.status,
        updatedAt: new Date(), 
      })
      .where(eq(appointments.appointmentId, input.appointmentId))
      .returning();
  
    return result.at(0) || null;
  }
  
  
