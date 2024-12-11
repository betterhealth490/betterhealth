import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isDefined } from "./lib/utils";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/faq",
  "/contact",
  "/login(.*)",
  "/signup(.*)",
  "/clerk",
]);

type MemberMetadata = {
  role: "member";
  databaseId: string;
  questionnaireCompleted: boolean;
};

type TherapistMetadata = {
  role: "therapist";
  databaseId: string;
  licenseNumber: string;
};

export type UserMetadata = MemberMetadata | TherapistMetadata;

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  // Redirect visitors when accessing protected pages
  if (!isDefined(userId) && !isPublicRoute(request)) {
    return redirectToSignIn();
  }
  const userMetadata = sessionClaims?.unsafeMetadata as UserMetadata;
  if (isDefined(userId) && isDefined(userMetadata)) {
    // Redirect to the startup page if member hasn't completed the initial survey
    // otherwise redirect to the dashboard
    if (
      userMetadata.role === "member" &&
      !userMetadata.questionnaireCompleted &&
      !request.url.includes("/startup")
    ) {
      return NextResponse.redirect(new URL("/startup", request.url));
    } else if (isPublicRoute(request)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
