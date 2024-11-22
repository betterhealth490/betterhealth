export class PublicError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class AuthenticationError extends PublicError {
    constructor() {
        super("You must be logged in to view this content");
        this.name = "AuthenticationError";
    }
}

export class EmailInUseError extends PublicError {
    constructor() {
        super("Email is already in use");
        this.name = "EmailInUseError";
    }
}

export class LicenseInUseError extends PublicError {
    constructor() {
        super("License number is already in use");
        this.name = "LicenseInUseError";
    }
}

export class SignUpError extends PublicError {
    constructor() {
        super("An error occurred while signing up");
        this.name = "SignUpError";
    }
}
