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

const isMemberRoute = createRouteMatcher([
  "/dashboard",
  "/inbox",
  "/journal",
  "/appointments",
  "/settings",
  "/billing",
]);

const isTherapistRoute = createRouteMatcher([
  "/dashboard",
  "/inbox",
  "/journal",
  "/appointments",
  "/settings",
  "/billing",
]);

const isInactiveRoute = createRouteMatcher(["/settings"]);

const isStartupRoute = createRouteMatcher(["/startup"]);

type UserMetadata = {
  role: "member" | "therapist";
  databaseId: string;
  questionnaireCompleted: boolean;
  active: boolean;
};

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  // Redirect visitors when accessing protected pages
  if (!isDefined(userId) && !isPublicRoute(request)) {
    return redirectToSignIn();
  }
  const metadata = sessionClaims?.unsafeMetadata as UserMetadata;
  if (isDefined(userId) && isDefined(metadata)) {
    const { role, questionnaireCompleted, active } = metadata;
    if (!active && !isInactiveRoute(request)) {
      return NextResponse.redirect(new URL("/settings", request.url));
    }
    if (questionnaireCompleted) {
      if (!active && !isInactiveRoute(request)) {
        return NextResponse.redirect(new URL("/settings", request.url));
      } else if (role === "member" && !isMemberRoute(request)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (role === "therapist" && !isTherapistRoute(request)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      if (!isStartupRoute(request)) {
        return NextResponse.redirect(new URL("/startup", request.url));
      }
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
