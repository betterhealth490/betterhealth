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
export const questionnaireTypeEnum = pgEnum("questionnaire_type", [
  "initial",
  "daily",
]);
export const relationshipStatusEnum = pgEnum("relationship_status", [
  "Pending",
  "Approved",
  "Declined",
]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "Pending",
  "Confirmed",
  "Cancelled",
]);
export const billingStatusEnum = pgEnum("billing_status", ["Pending", "Paid"]);
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
export const foodHealthEnum = pgEnum("food_health", ["Low", "Medium", "High"]);
export const sleepQualityEnum = pgEnum("sleep_quality", ["Poor", "Fair", "Good", "Excellent"]);
export const selfImageEnum = pgEnum("self_image", ["Negative", "Neutral", "Positive"]);
export const sleepTimeEnum = pgEnum("sleep_time", ["Before 8 PM", "8 PM - 10 PM", "10 PM - Midnight", "After Midnight"]);

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
  email: varchar("email", { length: 255 })
    .notNull()
    .references(() => users.email),
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
  email: varchar("email", { length: 255 })
    .notNull()
    .references(() => users.email),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Daily Survey Table
// sleepTime

export const survey = createTable("survey", {
  habitId: serial("habit_id").primaryKey(),
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
  sleepTime: sleepTimeEnum("sleep_time").notNull(),
  foodHealthQuality: foodHealthEnum("food_health").notNull(),
  mood: feelingEnum("feeling").notNull(),
  sleepQuality: sleepQualityEnum("sleep_quality").notNull(),
  selfImage: selfImageEnum("self_image").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Initial Patient Questionnare Table
export const initialPatientQuestionnare = createTable(
  "initial_patient_questionnaire",
  {
    questionnaireId: serial("questionnaire_id").primaryKey(),
    patientId: integer("patient_id")
      .notNull()
      .references(() => patient.patientId),
    questionnaireDate: timestamp("questionnaire_date").notNull(),
    questionnaireType: questionnaireTypeEnum("questionnaire_type")
      .default("initial")
      .notNull(),
    questionnaireData: json("questionnaire_data"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
);

// Initial Therapist Questionnare Table
export const initialTherapistQuestionnare = createTable(
  "initial_therapist_questionnaire",
  {
    questionnaireId: serial("questionnaire_id").primaryKey(),
    patientId: integer("patient_id")
      .notNull()
      .references(() => patient.patientId),
    questionnaireDate: timestamp("questionnaire_date").notNull(),
    questionnaireType: questionnaireTypeEnum("questionnaire_type")
      .default("initial")
      .notNull(),
    questionnaireData: json("questionnaire_data"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
);

// Therapist Survey Table
export const therapistQuestionnare = createTable("therapist_questionnare", {
  questionnareId: serial("questionnaire_id").primaryKey(),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapist.therapistId),
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
export const therapistPatient = createTable("therapist_patient", {
  relationshipId: serial("relationship_id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.patientId),
  therapistId: integer("therapist_id")
    .notNull()
    .references(() => therapist.therapistId),
  status: relationshipStatusEnum("status").default("Pending"),
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
  status: appointmentStatusEnum("status").default("Pending").notNull(),
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
  status: billingStatusEnum("status").default("Pending"),
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

// Audit Tables
// export const healthHabitsAudit = createTable("health_habits_audit", {
//   auditId: serial("audit_id").primaryKey(),
//   habitId: integer("habit_id")
//     .notNull()
//     .references(() => healthHabits.habitId),
//     patientId: integer("patient_id")
//     .notNull()
//     .references(() => patient.patientId),
//   changeType: changeTypeEnum("change_type").notNull(),
//   changedAt: timestamp("changed_at")
//     .default(sql`CURRENT_TIMESTAMP`)
//     .notNull(),
//   previousData: json("previous_data"),
// });

// export const surveysAudit = createTable("surveys_audit", {
//   auditId: serial("audit_id").primaryKey(),
//   surveyId: integer("survey_id")
//     .notNull()
//     .references(() => surveys.surveyId),
//   patientId: integer("patient_id")
//     .notNull()
//     .references(() => patient.patientId),
//   changeType: changeTypeEnum("change_type").notNull(),
//   changedAt: timestamp("changed_at")
//     .default(sql`CURRENT_TIMESTAMP`)
//     .notNull(),
//   previousData: json("previous_data"),
// });

// export const billingAudit = createTable("billing_audit", {
//   auditId: serial("audit_id").primaryKey(),
//   billId: integer("bill_id")
//     .notNull()
//     .references(() => billing.billId),
//     patientId: integer("patient_id")
//     .notNull()
//     .references(() => patient.patientId),
//   changeType: changeTypeEnum("change_type").notNull(),
//   changedAt: timestamp("changed_at")
//     .default(sql`CURRENT_TIMESTAMP`)
//     .notNull(),
//   previousData: json("previous_data"),
// });

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
