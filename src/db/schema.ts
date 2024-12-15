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
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const ageEnum = pgEnum("age", [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
]);
export const specialtyEnum = pgEnum("specialty", [
  "lgbtq",
  "addiction",
  "health",
  "behavioral",
  "counseling",
]);

export const users = createTable(
  "user",
  {
    userId: serial("user_id").unique().primaryKey(),
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
  (user) => [
    {
      emailIndex: index("email_idx").on(user.email),
    },
  ],
);

// Therapist Table with Authentication Fields
export const therapists = createTable("therapist", {
  therapistId: integer("therapist_id")
    .primaryKey()
    .notNull()
    .references(() => users.userId),
  specialty: specialtyEnum("specialty"),
  licenseNumber: varchar("license_number", { length: 12 }).unique(),
  accepting: boolean("accepting").notNull().default(false),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Patient Table
export const patients = createTable("patient", {
  patientId: integer("patient_id")
    .primaryKey()
    .notNull()
    .references(() => users.userId),
  agePreference: ageEnum("age_preference"),
  genderPreference: genderEnum("gender_preference"),
  specialtyPreference: specialtyEnum("specialty_preference"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Daily Survey Table
export const surveys = createTable("survey", {
  surveyId: serial("survey_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
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
export const questionnaires = createTable("questionnaire", {
  questionnaireId: serial("questionnaire_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
  questionnaireDate: timestamp("questionnaire_date").notNull(),
  questionnaireData: json("questionnaire_data"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// TherapistPatient Relationship Table
export const relationships = createTable("relationship", {
  relationshipId: serial("relationship_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
  therapistId: serial("therapist_id")
    .notNull()
    .references(() => therapists.therapistId),
  status: relationshipStatusEnum("status").default("pending"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// TherapistComments Table
export const therapistComments = createTable("therapist_comment", {
  commentId: serial("comment_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
  therapistId: serial("therapist_id")
    .notNull()
    .references(() => therapists.therapistId),
  comment: text("comment"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Appointments Table
export const appointments = createTable("appointment", {
  appointmentId: serial("appointment_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
  therapistId: serial("therapist_id")
    .notNull()
    .references(() => therapists.therapistId),
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
export const billings = createTable("billing", {
  billId: serial("bill_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
  therapistId: serial("therapist_id")
    .notNull()
    .references(() => therapists.therapistId),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: billingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Journals Table
export const journals = createTable("journal", {
  journalId: serial("journal_id").unique().primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.patientId),
  title: varchar("title", { length: 100 }).notNull(),
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
  messageId: serial("message_id").unique().primaryKey(),
  senderId: integer("sender_id")
    .notNull()
    .references(() => users.userId),
  recipientId: serial("recipient_id")
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
  availabilityId: serial("availability_id").unique().primaryKey(),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapists.therapistId),
  day: integer("day").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});
