"use client";

import { ArrowRight, Heading1, Heart, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Navbar } from "~/app/(visitor)/navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
});

export default function HomePage() {
  return (
    <main className="bg-primary">
      <div>
        <ScreenOne>
          <ScreenOneText />
          <ScreenOneButtons />
        </ScreenOne>
        {process.env.VERCEL_ENV ?? "bruh"}
        <ScreenTwo>
          <ScreenTwoHeading />
          <ScreenTwoContent>
            <ScreenTwoText
              icon={<Heart className="h-12 w-12" />}
              label="Personalized Care"
              text="Tailored therapy sessions and resources designed to meet your unique needs."
            />
            <ScreenTwoText
              icon={<Users className="h-12 w-12" />}
              label="Expert Therapist"
              text="Connect with licensed, experienced professionals dedicated to your mental health."
            />
            <ScreenTwoText
              icon={<TrendingUp className="h-12 w-12" />}
              label="Progress Tracking"
              text="Monitor your journey with intuitive tools and insightful analytics."
            />
          </ScreenTwoContent>
        </ScreenTwo>

        <ScreenThree>
          <ScreenThreeHeading />
          <ScreenThreeContent>
            <ScreenThreeCard
              text='"BetterHealth has been a game-changer for my mental health. The therapists are compassionate, and the app makes it easy to stay on top of my progress."'
              name="Sarah D."
            />
            <ScreenThreeCard
              text='"As a busy professional, the flexibility of online sessions has been crucial. BetterHealth fits perfectly into my schedule, allowing me to prioritize my mental health."'
              name="Michael R."
            />
            <ScreenThreeCard
              text="&quot;The progress tracking feature is fantastic. It's motivating to see how far I've come in my journey to better mental health. BetterHealth has truly been a lifeline.&quot;"
              name="Emily L."
            />
          </ScreenThreeContent>
        </ScreenThree>

        <ScreenFour>
          <ScreenFourText />
        </ScreenFour>
      </div>
    </main>
  );
}

function ScreenOne(props: { children: React.ReactNode[] }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-4 text-white">
      {props.children}
    </div>
  );
}
function ScreenOneText() {
  return (
    <div className="flex w-[1100px] flex-col items-center gap-y-2.5">
      <h1 className="text-center text-6xl font-extrabold">
        Your Journey to Peace of Mind Starts Here
      </h1>
      <h2 className="w-[900px] text-center text-xl font-semibold">
        Connect with licensed therapists, track your progress, and access tools
        for your mental wellbeing, all in one secure platform.
      </h2>
    </div>
  );
}
function ScreenOneButtons() {
  return (
    <div className="flex w-full justify-center gap-x-2.5">
      <Button variant={"landingDefault"} asChild>
        <Link href="/signup">Get Started</Link>
      </Button>
    </div>
  );
}

function ScreenTwo(props: { children: React.ReactNode[] }) {
  return (
    <div className="flex h-[500px] w-full flex-col items-center justify-center gap-y-12 bg-gray-50">
      {props.children}
    </div>
  );
}
function ScreenTwoHeading() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-center text-5xl font-extrabold text-primary">
        Why Choose Us?
      </h1>
    </div>
  );
}
function ScreenTwoContent(props: { children: React.ReactNode[] }) {
  return <div className="flex justify-center gap-x-32">{props.children}</div>;
}
function ScreenTwoText(props: {
  label: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex w-1/5 flex-col items-center gap-y-2.5">
      {props.icon}
      <h2 className="text-xl font-semibold">{props.label}</h2>
      <span className="text-center text-muted-foreground">{props.text}</span>
    </div>
  );
}

function ScreenThree(props: { children: React.ReactNode[] }) {
  return (
    <div className="flex h-[500px] w-full flex-col items-center justify-center gap-y-12 bg-white">
      {props.children}
    </div>
  );
}
function ScreenThreeHeading() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-center text-5xl font-extrabold text-primary">
        What Our Users Say
      </h1>
    </div>
  );
}
function ScreenThreeContent(props: { children: React.ReactNode[] }) {
  return <div className="flex justify-center gap-x-8">{props.children}</div>;
}
function ScreenThreeCard(props: { text: string; name: string }) {
  return (
    <Card className="flex w-1/5 flex-col items-center gap-y-2.5 shadow-md">
      <CardContent className="pt-6">
        <span className="text-muted-foreground">{props.text}</span>
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <span className="font-semibold">- {props.name}</span>
      </CardFooter>
    </Card>
  );
}

function ScreenFour(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-[500px] w-full flex-col items-center justify-center gap-y-4 text-white">
      {props.children}
    </div>
  );
}
function ScreenFourText() {
  return (
    <div className="flex w-[1100px] flex-col items-center gap-y-2.5">
      <h1 className="text-center text-6xl font-extrabold">
        Ready to Start Your Journey?
      </h1>
      <h2 className="w-[700px] text-center text-xl font-semibold">
        Join thousands of others who have taken the first step towards better
        mental health.
      </h2>
    </div>
  );
}
