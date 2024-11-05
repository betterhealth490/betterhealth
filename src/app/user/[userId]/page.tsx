import { notFound } from "next/navigation";
import { getUserController } from "~/controllers/user";
import { db } from "~/db";

export default async function UserPage({
    params,
}: {
    params: { userId: string };
}) {
    const data = await getUserController(params.userId);
    if (!data.ok) {
        notFound();
    }
    const user = data.data;
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
                <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                    {user.firstName} {user.lastName}
                </h1>
                <span className="text-xl font-extrabold tracking-tight text-white sm:text-[2rem]">
                    {user.email}
                </span>
            </div>
        </main>
    );
}
