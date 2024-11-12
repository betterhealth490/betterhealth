import { SignIn } from "@clerk/nextjs";
import { Boilerplate } from "~/components/boilerplate";

export default function LoginPage() {
    return (
        <Boilerplate>
            <SignIn />
        </Boilerplate>
    );
}
