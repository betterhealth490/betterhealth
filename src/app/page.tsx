'use client'

import { ArrowRight, Heading1, Heart, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Navbar } from "~/components/visitor/navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email()
})

export default function HomePage() {
  return (
    <main className="bg-primary">
      <Navbar/>
      <div>
        <ScreenOne>
            <ScreenOneText/>
            <ScreenOneButtons/>
        </ScreenOne>

        <ScreenTwo>
            <ScreenTwoHeading/>
            <ScreenTwoContent>
                <ScreenTwoText 
                    icon={<Heart className="h-12 w-12"/>} 
                    label="Personalized Care" 
                    text="Tailored therapy sessions and resources designed to meet your unique needs."
                />
                <ScreenTwoText 
                    icon={<Users className="h-12 w-12"/>} 
                    label="Expert Therapist" 
                    text="Connect with licensed, experienced professionals dedicated to your mental health."
                />
                <ScreenTwoText 
                    icon={<TrendingUp className="h-12 w-12"/>} 
                    label="Progress Tracking" 
                    text="Monitor your journey with intuitive tools and insightful analytics."
                />
            </ScreenTwoContent>
        </ScreenTwo>

        <ScreenThree>
            <ScreenThreeHeading/>
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
                    text='"The progress tracking feature is fantastic. It&apos;s motivating to see how far I&apos;ve come in my journey to better mental health. BetterHealth has truly been a lifeline."'
                    name="Emily L."
                />
            </ScreenThreeContent>
        </ScreenThree>

        <ScreenFour>
            <ScreenFourText/>
            <ScreenFourInput/>
        </ScreenFour>
      </div>
    </main>
  );
}

function ScreenOne(props: {children: React.ReactNode[]}){
    return(
        <div className="w-full h-screen flex flex-col gap-y-4 justify-center items-center text-white">
            {props.children}
        </div>
    )
}
function ScreenOneText() {
    return (
      <div className="flex flex-col w-[1100px] gap-y-2.5 items-center">
        <h1 className="text-center text-6xl font-extrabold">
          Your Journey to Peace of Mind Starts Here
        </h1>
        <h2 className="w-[900px] text-center text-xl font-semibold">
          Connect with licensed therapists, track your progress, and access
          tools for your mental wellbeing, all in one secure platform.
        </h2>
      </div>
    );
}
function ScreenOneButtons(){
    return(
        <div className="w-full flex justify-center gap-x-2.5">
            <Button variant={"landingDefault"} asChild>
                <Link href="/signup">Get Started</Link>
            </Button>
            <Button variant={"landingOutline"}>
                <Link href="/about">Learn More</Link>
            </Button>
        </div>
    )
}

function ScreenTwo(props: {children: React.ReactNode[]}){
    return(
        <div className="w-full h-[500px] flex flex-col gap-y-12 justify-center items-center bg-gray-50">
            {props.children}
        </div>
    )
}
function ScreenTwoHeading(){
    return(
        <div className="flex items-center justify-center">
            <h1 className="text-5xl font-extrabold text-primary text-center">
                Why Choose Us?
            </h1>
        </div>
    )
}
function ScreenTwoContent(props: {children: React.ReactNode[]}){
    return(
        <div className="flex justify-center gap-x-32">
            {props.children}
        </div>
    )
}
function ScreenTwoText(props: {label: string, text: string, icon: React.ReactNode}){
    return(
        <div className="w-1/5 flex flex-col gap-y-2.5 items-center">
            {props.icon}
            <h2 className="font-semibold text-xl">{props.label}</h2>
            <span className="text-muted-foreground text-center">{props.text}</span>
        </div>
    )
}

function ScreenThree(props: {children: React.ReactNode[]}){
    return(
        <div className="w-full h-[500px] flex flex-col gap-y-12 justify-center items-center bg-white">
            {props.children}
        </div>
    )
}
function ScreenThreeHeading(){
    return(
        <div className="flex items-center justify-center">
            <h1 className="text-5xl font-extrabold text-primary text-center">
                What Our Users Say
            </h1>
        </div>
    )
}
function ScreenThreeContent(props: {children: React.ReactNode[]}){
    return(
        <div className="flex justify-center gap-x-8">
            {props.children}
        </div>
    )
}
function ScreenThreeCard(props: {text: string, name: string}){
    return(
        <Card className="w-1/5 flex flex-col gap-y-2.5 items-center shadow-md">
            <CardContent className="pt-6">
                <span className="text-muted-foreground">{props.text}</span>
            </CardContent>
            <CardFooter className="w-full flex justify-end">
                <span className="font-semibold">- {props.name}</span>
            </CardFooter>
        </Card>
    )
}

function ScreenFour(props: {children: React.ReactNode[]}){
    return(
        <div className="w-full h-[500px] flex flex-col gap-y-4 justify-center items-center text-white">
            {props.children}
        </div>
    )
}
function ScreenFourText() {
    return (
      <div className="flex flex-col w-[1100px] gap-y-2.5 items-center">
        <h1 className="text-center text-6xl font-extrabold">
          Ready to Start Your Journey?
        </h1>
        <h2 className="w-[700px] text-center text-xl font-semibold">
          Join thousands of others who have taken the first step towards better mental health.
        </h2>
      </div>
    );
}
function ScreenFourInput(){
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
    })
    const router = useRouter()

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.push("/signup?email="+values.email)
    }
    return(
        <Form {...form}>
            <form className="w-full flex justify-center gap-x-2.5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField name="email" render={({ field })=>(
                    <FormItem>
                        <FormControl>
                            <div className="flex flex-col gap-y-2.5">
                                <div className="flex gap-x-2.5 justify-center">
                                    <Input placeholder="Enter your email" className="w-fit text-foreground" {...field}/>
                                    <Button variant={"landingDefault"}>
                                        Sign Up
                                        <ArrowRight className="w-6 h-6"/>
                                    </Button>
                                </div>
                                <FormMessage className="text-white"/>
                            </div>
                        </FormControl>
                    </FormItem>
                )}/>
            </form>      
        </Form>
    )
}
