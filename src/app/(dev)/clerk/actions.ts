"use server";

import { clerkClient, type User } from "@clerk/nextjs/server";
import { db } from "~/db";
import { users } from "~/db/schema";

type ServerResponse =
  | { ok: true; result: User[] }
  | { ok: false; error: string };

export const migrateUsersAction: () => Promise<ServerResponse> = async () => {
  try {
    const clerkUsers = [];
    const dbUsers = await db.select().from(users);
    for (const user of dbUsers) {
      const client = await clerkClient();
      clerkUsers.push(
        await client.users.createUser({
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          emailAddress: [user.email],
          createdAt: user.createdAt,
          unsafeMetadata: {
            role: user.role,
            databaseId: user.userId,
            questionnaireCompleted: true,
          },
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return { ok: true, result: clerkUsers };
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
    for (const user of users.data) {
      promises.push(client.users.deleteUser(user.id));
    }
    await Promise.all(promises);
    return { ok: true, result: [] };
  } catch (err) {
    if (err instanceof Error) {
      return { ok: false, error: err.message };
    } else {
      return { ok: false, error: "Unknown error occurred" };
    }
  }
};
