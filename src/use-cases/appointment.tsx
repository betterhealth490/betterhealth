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
        throw new Error("No journal found")
    }
}

export async function updateAppointmentItem(input: UpdateAppointmentInput): Promise<UpdateAppointmentResult> {
    const result = await db
        .select()
        .from(appointments)
        .where(
            and(
                eq(appointments.appointmentDate, input.appointmentDate),
                eq(appointments.appointmentId, input.appointmentId),
                eq(appointments.notes, input.notes),
            )
        );
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No journal found")
    }
}

export async function createAppointmentItem(input: CreateAppointmentInput): Promise<CreateAppointmentResult> {
    const result = await db
        .select()
        .from(appointments)
        .where(
            and(
                eq(appointments.appointmentDate, input.appointmentDate),
                eq(appointments.appointmentId, input.appointmentId),
                eq(appointments.patientId, input.patientId),
                eq(appointments.therapistId, input.therapistId),
                eq(appointments.notes, input.notes),
            )
        );
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No journal found")
    }
}

export async function listAppointmentItem(input: ListAppointmentsInput): Promise<ListAppointmentsItem> {
    const result = await db
        .select()
        .from(appointments)
        .where(
            eq(appointments.patientId, input.userId)
        );
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No journal found")
    }
}

