import { relations, sql } from "drizzle-orm";
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
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `betterhealth_${name}`);

// Enums
export const roleEnum = pgEnum("role", ["therapist", "patient"]);
export const surveyTypeEnum = pgEnum("survey_type", ["initial", "daily"]);
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

// Users Table
export const users = createTable(
    "user",
    {
        userId: serial("user_id").primaryKey(),
        email: varchar("email", { length: 256 }).notNull().unique(),
        role: roleEnum("role").notNull(),
        username: varchar("username", { length: 256 }).notNull().unique(),
        password: varchar("password", { length: 256 }).notNull(),
        firstName: varchar("first_name", { length: 100 }).notNull(),
        lastName: varchar("last_name", { length: 100 }).notNull(),
        licenseNumber: varchar("license_number", { length: 50 }),
        isVerified: boolean("is_verified").default(false),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    },
    (user) => ({
        emailIndex: index("email_idx").on(user.email),
        usernameIndex: index("username_idx").on(user.username),
    }),
);

// LicenseVerification Table
export const licenseVerification = createTable("license_verification", {
    licenseId: serial("license_id").primaryKey(),
    licenseNumber: varchar("license_number", { length: 50 }).notNull().unique(),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// HealthHabits Table
export const healthHabits = createTable("health_habits", {
    habitId: serial("habit_id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
    date: timestamp("date").notNull(),
    waterIntake: integer("water_intake"),
    sleepHours: integer("sleep_hours"),
    mealsEaten: integer("meals_eaten"),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// Surveys Table
export const surveys = createTable("surveys", {
    surveyId: serial("survey_id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
    surveyDate: timestamp("survey_date").notNull(),
    surveyType: surveyTypeEnum("survey_type").notNull(),
    surveyData: json("survey_data"),
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
        .references(() => users.userId),
    therapistId: integer("therapist_id")
        .notNull()
        .references(() => users.userId),
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
        .references(() => users.userId),
    therapistId: integer("therapist_id")
        .notNull()
        .references(() => users.userId),
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
        .references(() => users.userId),
    therapistId: integer("therapist_id")
        .notNull()
        .references(() => users.userId),
    appointmentDate: timestamp("appointment_date").notNull(),
    status: appointmentStatusEnum("status").default("pending"),
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
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
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
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
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
export const healthHabitsAudit = createTable("health_habits_audit", {
    auditId: serial("audit_id").primaryKey(),
    habitId: integer("habit_id")
        .notNull()
        .references(() => healthHabits.habitId),
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
    changeType: changeTypeEnum("change_type").notNull(),
    changedAt: timestamp("changed_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    previousData: json("previous_data"),
});

export const surveysAudit = createTable("surveys_audit", {
    auditId: serial("audit_id").primaryKey(),
    surveyId: integer("survey_id")
        .notNull()
        .references(() => surveys.surveyId),
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
    changeType: changeTypeEnum("change_type").notNull(),
    changedAt: timestamp("changed_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    previousData: json("previous_data"),
});

export const billingAudit = createTable("billing_audit", {
    auditId: serial("audit_id").primaryKey(),
    billId: integer("bill_id")
        .notNull()
        .references(() => billing.billId),
    userId: integer("user_id")
        .notNull()
        .references(() => users.userId),
    changeType: changeTypeEnum("change_type").notNull(),
    changedAt: timestamp("changed_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    previousData: json("previous_data"),
});
