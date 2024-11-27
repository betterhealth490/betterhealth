"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HeartHandshake } from "lucide-react";
import { doHyeon } from "~/lib/utils";
import { SignOutButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header
      className={
        "fixed top-0 flex h-14 w-full items-center bg-primary text-white"
      }
    >
      <div className="flex w-full justify-between gap-x-3 px-32 align-middle">
        <div className="hidden" />
        <div className="flex gap-x-1 space-x-1">
          <Link href="/" className="flex items-center gap-x-2 pr-8">
            <HeartHandshake className="h-8 w-8" />
            <span
              className={`gap-x-2.5 align-middle text-2xl font-bold ${doHyeon.className}`}
            >
              betterhealth
            </span>
          </Link>
        </div>

        <div className="flex w-full justify-end gap-x-5 space-x-1">
          <SignOutButton>
            <Button variant="landingOutline">Logout</Button>
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}
