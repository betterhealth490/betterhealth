import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  json,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  decimal,
  date,
  time,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `betterhealth_${name}`);

// Enums
export const roleEnum = pgEnum("role", ["therapist", "member"]);
export const relationshipStatusEnum = pgEnum("relationship_status", [
  "pending",
  "approved",
  "declined",
]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "cancelled",
]);
export const billingStatusEnum = pgEnum("billing_status", ["pending", "paid"]);
export const changeTypeEnum = pgEnum("change_type", [
  "insert",
  "update",
  "delete",
]);
export const feelingEnum = pgEnum("feeling", [
  "Excited",
  "Happy",
  "Okay",
  "Mellow",
  "Sad",
  "I don't know",
]);
export const genderEnum = pgEnum("gender", ["Male", "Female", "Other"]);
export const ageEnum = pgEnum("age", [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
]);
export const specialtyEnum = pgEnum("specialty", [
  "Anxiety",
  "Depression",
  "PTSD",
  "Bipolar Disorder",
  "Obsessive-Compulsive Disorder",
  "Stress Management",
  "Anger Management",
]);

export const users = createTable(
  "users",
  {
    userId: serial("user_id").primaryKey(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    age: integer("age"),
    gender: genderEnum("gender"),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (user) => ({
    emailIndex: index("email_idx").on(user.email),
  }),
);

// Therapist Table with Authentication Fields
export const therapist = createTable("therapist", {
  therapistId: serial("user_id").primaryKey(),
  specialty: specialtyEnum("specialty").notNull(),
  licenseNumber: varchar("license_number", { length: 12 }).unique(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Patient Table
export const patient = createTable("patient", {
  patientId: serial("user_id").primaryKey(),
  agePreference: ageEnum("age").notNull(),
  genderPreference: genderEnum("gender").notNull(),
  specialtyPreference: specialtyEnum("specialty").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Daily Survey Table
export const survey = createTable("survey", {
  surveyId: serial("survey_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  // number of glasses drank
  waterIntake: integer("water_intake").notNull(),
  // hours of sleep
  sleepLength: integer("sleep_length").notNull(),
  // stress level from 0-5
  stressLevel: integer("stress_level").notNull(),
  // how many meals eaten
  foodIntake: integer("food_intake").notNull(),
  sleepTime: integer("sleep_time").notNull(),
  foodHealthQuality: integer("food_quality").notNull(),
  mood: feelingEnum("feeling").notNull(),
  sleepQuality: integer("sleep_quality").notNull(),
  selfImage: integer("self_image").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Initial Questionnare Table
export const initialQuestionnare = createTable(
  "initial_questionnaire",
  {
    questionnaireId: serial("questionnaire_id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.userId),
    questionnaireDate: timestamp("questionnaire_date").notNull(),
    questionnaireData: json("questionnaire_data"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
);

// TherapistPatient Relationship Table
export const therapistPatient = createTable("therapist_patient", {
  relationshipId: serial("relationship_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapist.therapistId),
  status: relationshipStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// TherapistComments Table
export const therapistComments = createTable("therapist_comments", {
  commentId: serial("comment_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapist.therapistId),
  comment: text("comment"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Appointments Table
export const appointments = createTable("appointments", {
  appointmentId: serial("appointment_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapist.therapistId),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  notes: varchar("notes", { length: 500 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Billing Table
export const billing = createTable("billing", {
  billId: serial("bill_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: billingStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Journals Table
export const journals = createTable("journals", {
  journalId: serial("journal_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  entryDate: timestamp("entry_date").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Messages Table
export const messages = createTable("message", {
  messageId: serial("message_id").primaryKey(),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.userId),
  recipientId: integer("recipient_id")
    .notNull()
    .references(() => users.userId),
  message: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  sentAt: timestamp("sent_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const availability = createTable("availability", {
  availabilityId: serial("availability_id").primaryKey(),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapist.therapistId),
  availableDate: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isBooked: boolean("is_booked").default(false).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
