import { eq, and, sql } from "drizzle-orm";
import { db } from "~/db";
import { appointments, relationships, users, availability } from "~/db/schema";
import { 
    type GetAppointmentInput, 
    type GetAppointmentResult, 
    type ListAppointmentsInput,
    type ListAppointmentsItem,
    type ListAppointmentsResult,
    type UpdateAppointmentInput,
    type UpdateAppointmentResult,
    type CreateAppointmentInput,
    type CreateAppointmentResult,
    type GetTherapistAvailabilityInput,
    type GetTherapistAvailabilityResult
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
            patientId: appointments.patientId,
            status: appointments.status, // Include the status field
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
  
    // Map the result to a more user-friendly format
    return result.map((therapist) => ({
      therapistId: therapist.therapistId,
      name: `${therapist.firstName} ${therapist.lastName}`,
    }));
  }



  
  export async function getTherapistAvailability(
    input: GetTherapistAvailabilityInput
  ): Promise<GetTherapistAvailabilityResult | null> {
    // Fetch therapist's availability for the given day
    const availabilityQueryResult = await db
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
  
    const availabilityData = availabilityQueryResult.at(0);
    if (!availabilityData) {
      return null; // No availability for this day
    }
  
    // Parse the availability into start and end times
    const start = parseTime(availabilityData.startTime);
    const end = parseTime(availabilityData.endTime);
  
    // Fetch existing appointments for the given date and therapist
    const existingAppointments = await db
      .select({
        appointmentTime: sql`TO_CHAR(${appointments.appointmentDate}, 'HH24:MI')`.as<string>(),
      })
      .from(appointments)
      .where(
        and(
          eq(appointments.therapistId, input.therapistId),
          sql`DATE(${appointments.appointmentDate}) = ${input.date}`
        )
      );
  
    // Extract booked time slots from the appointments
    const bookedSlots = existingAppointments.map((appointment) => appointment.appointmentTime);
  
    // Generate all time slots and exclude booked ones
    const availableSlots = generateTimeSlots(start, end).filter(
      (slot) => !bookedSlots.includes(slot)
    );
  
    return {
      day: availabilityData.day,
      availableSlots,
    };
  }
  
  // Utility function to parse time strings (HH:MM) into hours and minutes
  function parseTime(timeString: string): [number, number] {
    const [hourStr, minuteStr] = timeString.split(":");
    const hours = Number(hourStr);
    const minutes = Number(minuteStr);
  
    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Invalid time format: "${timeString}"`);
    }
  
    return [hours, minutes];
  }
  
  // Utility function to generate 30-minute time slots between start and end times
  function generateTimeSlots(start: [number, number], end: [number, number]): string[] {
    const slots: string[] = [];
    let [currentHours, currentMinutes] = start;
  
    while (
      currentHours < end[0] ||
      (currentHours === end[0] && currentMinutes < end[1])
    ) {
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
  }
  