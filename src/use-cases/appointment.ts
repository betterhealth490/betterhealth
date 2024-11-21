import { eq, and } from "drizzle-orm";
import { db } from "~/db";
import { appointments } from "~/db/schema";
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
            patientId: appointments.patientId
        })
        .from(appointments)
        .where(
            and(
                eq(appointments.patientId, input.userId)
            )
        );
        
    return result;
}
