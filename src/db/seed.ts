/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable drizzle/enforce-delete-with-where */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { db } from "./index";
import {
  users,
  therapists,
  patients,
  relationships,
  availability,
  appointments,
  journals,
  surveys,
  billings,
  therapistComments,
} from "./schema";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import "dotenv/config";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { format } from "date-fns";

// Helper function to read CSV
function readCsvFile(filename: string) {
  const csvFilePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "seed-data",
    filename,
  );
  const fileContent = readFileSync(csvFilePath, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    delimiter: ",",
    quote: '"',
    escape: '"',
    relax_quotes: true,
  });
}

// Helper function to create Date object from time string
function createTimeDate(time: string) {
  const [timePart, modifier] = time.split(" "); // Split time and AM/PM
  const [hours, minutes] = timePart!.split(":"); // Split hours and minutes
  const date = new Date(); // Create a new date object
  date.setHours(
    parseInt(hours!) + (modifier === "PM" ? 12 : 0),
    parseInt(minutes!),
    0,
    0,
  ); // Set hours and minutes
  return format(date, "HH:mm"); // Return the date object
}

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(therapistComments);
    await db.delete(billings);
    await db.delete(surveys);
    await db.delete(journals);
    await db.delete(appointments);
    await db.delete(availability);
    await db.delete(relationships);
    await db.delete(therapists);
    await db.delete(patients);
    await db.delete(users);

    // Read and insert users
    console.log("Inserting users...");
    const userData = readCsvFile("users.csv");
    await db
      .insert(users)
      .values(
        userData.map((user: any) => {
          return {
            userId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            password: user.password,
            role: user.role,
            age: user.age ?? null,
            gender: user.gender,
          };
        }),
      )
      .returning();

    // Read and insert therapists
    console.log("Inserting therapists...");
    const therapistData = readCsvFile("therapists.csv");
    await db
      .insert(therapists)
      .values(
        therapistData.map((therapist: any) => {
          return {
            therapistId: therapist.therapist_id,
            specialty: therapist.specialty,
            licenseNumber: therapist.license_number,
            accepting: therapist.accepting === "true",
          };
        }),
      )
      .returning();

    // Read and insert patients
    console.log("Inserting patients...");
    const patientData = readCsvFile("patients.csv");
    await db
      .insert(patients)
      .values(
        patientData.map((patient: any) => {
          return {
            patientId: patient.patient_id,
            agePreference: patient.age_preference || null,
            genderPreference: patient.gender_preference || null,
            specialtyPreference: patient.specialty_preference || null,
          };
        }),
      )
      .returning();

    // Read and insert relationships
    console.log("Inserting relationships...");
    const relationshipData = readCsvFile("relationships.csv");
    await db.insert(relationships).values(
      relationshipData.map((rel: any) => ({
        patientId: rel.patient_id,
        therapistId: rel.therapist_id,
        status: rel.status,
      })),
    );

    // Read and insert availability
    console.log("Inserting availability...");
    const availabilityData = readCsvFile("availability.csv");
    await db
      .insert(availability)
      .values(
        availabilityData.map((avail: any) => {
          return {
            availabilityId: avail.availability_id,
            therapistId: avail.therapist_id,
            day: avail.day,
            startTime: createTimeDate(avail.startTime), // Convert to Date
            endTime: createTimeDate(avail.endTime), // Convert to Date
          };
        }),
      )
      .returning();

    // Read and insert appointments
    console.log("Inserting appointments...");
    const appointmentData = readCsvFile("appointments.csv");
    await db
      .insert(appointments) // Ensure you have imported the appointments schema
      .values(
        appointmentData.map((appointment: any) => {
          return {
            appointmentId: appointment.appointment_id,
            patientId: appointment.patient_id,
            therapistId: appointment.therapist_id,
            appointmentDate: new Date(appointment.appointment_date),
            status: appointment.status,
            notes: appointment.notes,
          };
        }),
      )
      .returning();

    // Read and insert journals
    console.log("Inserting journals...");
    const journalData = readCsvFile("journals.csv");
    await db
      .insert(journals) // Ensure you have imported the journals schema
      .values(
        journalData.map((journal: any) => {
          return {
            journalId: journal.journal_id,
            patientId: journal.patient_id,
            entryDate: new Date(journal.entry_date),
            title: journal.title,
            content: journal.content,
          };
        }),
      )
      .returning();

    // Read and insert surveys
    console.log("Inserting surveys...");
    const surveyData = readCsvFile("surveys.csv");
    await db
      .insert(surveys)
      .values(
        surveyData.map((survey: any) => {
          return {
            surveyId: survey.survey_id,
            patientId: survey.patient_id,
            createdAt: new Date(survey.created_at),
            waterIntake: survey.water_intake,
            foodIntake: survey.food_intake,
            foodHealthQuality: survey.food_health_quality,
            sleepTime: survey.sleep_time,
            sleepQuality: survey.sleep_quality,
            sleepLength: survey.sleep_length,
            stressLevel: survey.stress_level,
            selfImage: survey.self_image,
          };
        }),
      )
      .returning();

    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed().catch((err) => {
  console.error("Failed to seed database:", err);
  process.exit(1);
});

export {};
