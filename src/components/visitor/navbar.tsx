'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { Ghost, HeartHandshake } from "lucide-react";
import { Do_Hyeon } from "next/font/google"
import { useEffect, useState } from "react";

const doHyeon = Do_Hyeon({weight: "400", subsets: ["latin"]})

export function Navbar(){
    const [scroll, setScroll]=useState<boolean>(false)

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
      <header className={`sticky top-0 w-full ${scroll ? "bg-white border border-b border-border/40 text-primary" : "bg-primary text-white"}`}>
        <div className="flex gap-x-3 px-32 py-6 align-middle">
          <div className="flex gap-x-1 space-x-1">
            <Link href="/" className="flex items-center gap-x-2 pr-8">
              <HeartHandshake className="h-8 w-8" />
              <span className={`gap-x-2.5 align-middle text-2xl font-bold ${doHyeon.className}`}>
                betterhealth
              </span>
            </Link>

            <Link href="/about">
              <Button
                variant="link"
                className={`${scroll ? "bg-white text-primary" : "bg-primary text-white"} text-lg transition-none`}
              >
                About
              </Button>
            </Link>

            <Link href="/faq">
              <Button
                variant="link"
                className={`${scroll ? "bg-white text-primary" : "bg-primary text-white"} text-lg transition-none`}
              >
                FAQ
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="link"
                className={`${scroll ? "bg-white text-primary" : "bg-primary text-white"} text-lg transition-none`}
              >
                Contact Us
              </Button>
            </Link>
          </div>

          <div className="flex w-full justify-end gap-x-5 space-x-1">
            <Link href="/login">
              <Button
                variant={scroll ? "landingScrollOutline" : "landingOutline"}
                className="text-lg"
              >
                Log In
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                variant={scroll ? "default" : "landingDefault"}
                className="text-lg transition-all"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
    );
}