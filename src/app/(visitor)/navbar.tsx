"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { doHyeon } from "~/lib/utils";

export function Navbar() {
  const [scroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 0) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      }
    });
  }, []);

  return (
    <header
      className={`fixed top-0 flex h-14 w-full items-center ${scroll ? "border border-b border-border/40 bg-white text-primary" : "bg-primary text-white"}`}
    >
      <div className="flex w-full justify-between gap-x-3 px-32 align-middle">
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
          <Link href="/login">
            <Button
              variant={scroll ? "landingScrollOutline" : "landingOutline"}
            >
              Log In
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              variant={scroll ? "default" : "landingDefault"}
              className="transition-all"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
