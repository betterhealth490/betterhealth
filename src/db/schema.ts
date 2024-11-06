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
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `betterhealth_${name}`);

export const roleEnum = pgEnum("role", ["therapist", "patient"]);

export const users = createTable(
    "user",
    {
        userId: serial("user_id").primaryKey(),
        username: varchar("username", { length: 256 }).notNull(),
        password: varchar("password", { length: 256 }).notNull(),
        email: varchar("email", { length: 256 }).notNull(),
        role: roleEnum("role"),
        firstName: varchar("first_name", { length: 100 }).notNull(),
        lastName: varchar("last_name", { length: 100 }).notNull(),
        licenseNumber: varchar("license_number", { length: 50 }),
        isVerified: boolean("is_verified").default(false),
        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    },
    (example) => ({
        usernameIndex: index("username_idx").on(example.username),
        emailIndex: index("email_idx").on(example.email),
    }),
);

export const authentication = createTable(
    "authentication",
    {
        authId: serial("auth_id").primaryKey(),
        userId: serial("user_id").notNull().references(() => users.userId),
        username: varchar("username", {length:256}).notNull(),
        passwordHash: varchar("password_hash", {length: 256}),
        lastLogin: timestamp("last_login").$onUpdate(() => sql`CURRENT_TIMESTAMP`).notNull(),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
);

export const licenseVerification = createTable(
    "license_verification",
    {
        verificationId: serial("verification_id").primaryKey(),
        userId: serial("user_id").notNull().references(() => users.userId),
        licenseNumber: varchar("license_number", {length: 50}).notNull(),
        isVerified: boolean("is_verified").default(false),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
);

export const healthHabits = createTable(
    "health_habits",
    {
        habitId: serial("habit_id").primaryKey(),
        userId: serial("user_id").notNull().references(()=> users.userId),
        date: timestamp("date").default(sql`CURRENT_TIMESTAMP`).notNull(),
        waterIntake: serial("water_intake").notNull(),
        sleepHours: serial("sleep_hours").notNull(),
        mealsEaten: serial("meals_eaten").notNull(),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
);

export const surveyEnum = pgEnum("survey_type", ["Initial", "Daily"]);
export const surveys = createTable(
    "surveys",
    {
        surveyId: serial("survey_id").primaryKey(),
        userId: serial("user_id").notNull().references(()=>users.userId),
        surveyDate: timestamp("survey_date").default(sql`CURRENT_TIMESTAMP`).notNull(),
        surveyType: surveyEnum("survey_type"),
        surveyData: json("survey_data").notNull(),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
);

export const statusEnum = pgEnum("status", ["Pending", "Approved", "Declined"]);
export const therapistPatient = createTable(
    "therapist_patient",
    {
        relationshipId: serial("relationship_id").primaryKey(),
        patientId: serial("patient_id").notNull().references(()=>users.userId),
        therapistId: serial("therapistId").notNull().references(()=>users.userId),
        status: statusEnum("status").default("Pending"),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
);

export const therapistComments = createTable(
    "therapist_comments",
    {
        commentId: serial("comment_id").primaryKey(),
        patientId: serial("patient_id").notNull().references(()=>users.userId),
        therapistId: serial("therapistId").notNull().references(()=>users.userId),
        comment: text("comment").notNull(),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
);

export const appointments = createTable(
    "appointments",
    {
        appointmentId: serial("appointment_id").primaryKey(),
        patientId: serial("patient_id").notNull().references(()=>users.userId),
        therapistId: serial("therapistId").notNull().references(()=>users.userId),
        appointmentDate: timestamp("appointment_date").notNull(),
        status: statusEnum("status").default("Pending"),
        createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
        updatedAt: timestamp("updated_at").$onUpdate(()=> sql`CURRENT_TIMESTAMP`)
    }
)