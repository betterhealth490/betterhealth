import { Boilerplate } from "~/components/boilerplate";
import { SignInForm } from "~/components/signin-form";

export default function LoginPage() {
    return (
        <Boilerplate custom={true}>
            <SignInForm />
        </Boilerplate>
    );
}
