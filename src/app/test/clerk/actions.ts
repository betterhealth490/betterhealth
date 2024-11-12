"use server";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { db } from "~/db";

type ServerResponse = { ok: true } | { ok: false; error: string };

export const migrateUsersAction: () => Promise<ServerResponse> = async () => {
    try {
        const promises: Promise<User>[] = [];
        const users = await db.query.users.findMany();
        users.forEach(async (user) => {
            const client = await clerkClient();
            promises.push(
                client.users.createUser({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: user.password,
                    emailAddress: [user.email],
                    createdAt: user.createdAt,
                    externalId: user.userId.toString(),
                    privateMetadata: {
                        role: user.role,
                        licenseNumber: user.licenseNumber,
                        isVerified: user.isVerified,
                    },
                }),
            );
        });
        await Promise.all(promises);
        return { ok: true };
    } catch (err) {
        if (err instanceof Error) {
            return { ok: false, error: err.message };
        } else {
            return { ok: false, error: "Unknown error occurred" };
        }
    }
};

export const deleteUsersAction: () => Promise<ServerResponse> = async () => {
    try {
        const client = await clerkClient();
        const users = await client.users.getUserList({ limit: 100 });
        const promises: Promise<User>[] = [];
        users.data.forEach(async (user) => {
            promises.push(client.users.deleteUser(user.id));
        });
        await Promise.all(promises);
        return { ok: true };
    } catch (err) {
        if (err instanceof Error) {
            return { ok: false, error: err.message };
        } else {
            return { ok: false, error: "Unknown error occurred" };
        }
    }
};
