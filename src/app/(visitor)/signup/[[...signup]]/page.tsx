import { Boilerplate } from "~/components/boilerplate";
import { SignUpForm } from "~/components/signup-form";

export default function SignupPage() {
    return (
        <Boilerplate custom={true}>
            <SignUpForm />
        </Boilerplate>
    );
}
