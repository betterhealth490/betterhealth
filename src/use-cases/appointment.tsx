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

module.exports = getAppointment;

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

module.exports = updateAppointmentItem;

export async function createAppointmentItem(input: CreateAppointmentInput): Promise<CreateAppointmentResult> {
    const result: any = await db
        .insert(appointments)
        .values({
            appointmentId: input.appointmentId,
            patientId: input.patientId,
            therapistId: input.therapistId,
            appointmentDate: input.appointmentDate,
            notes: input.notes
        });
    
    
    const appointment = result;
    if (appointment) {
        return appointment
    } else {
        throw new Error("No appointment found")
    }
}

module.exports = createAppointmentItem;

export async function listAppointmentItem(input: ListAppointmentsInput): Promise<ListAppointmentsItem> {
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
        
    const appointment = result.at(0);
    if (appointment) {
        return appointment
    } else {
        throw new Error("No appointment found")
    }
}

module.exports = listAppointmentItem;