import { currentUser } from "@clerk/nextjs/server";
import { AuthenticationError } from "~/entities/errors";

export const assertAuthenticated = async () => {
    const user = await currentUser();
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
};
