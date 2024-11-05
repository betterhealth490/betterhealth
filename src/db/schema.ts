import { sql } from "drizzle-orm";
import {
    boolean,
    index,
    pgEnum,
    pgTableCreator,
    serial,
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
        role: roleEnum("role").notNull(),
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
