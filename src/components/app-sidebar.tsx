"use client";

import * as React from "react";
import { Book, Calendar, Command, HeartHandshake, Inbox } from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

import { Do_Hyeon } from "next/font/google";
import { z } from "zod";
import Link from "next/link";

const data = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Inbox",
        url: "/inbox",
        icon: Inbox,
    },
    {
        title: "Journal",
        url: "/journal",
        icon: Book,
    },
    {
        title: "Appointments",
        url: "/appointments",
        icon: Calendar,
    },
];

const doHyeon = Do_Hyeon({
    weight: "400",
    subsets: ["latin"],
});

const metadataSchema = z.object({
    role: z.enum(["therapist", "patient"]),
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, isLoaded } = useUser();
    if (!isLoaded || !user) {
        return null;
    }
    const appUser = {
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        username: user.username || undefined,
        email: user.emailAddresses[0]?.emailAddress || undefined,
        imageUrl: user.imageUrl || undefined,
    };
    const parsedUser = metadataSchema.safeParse(user.unsafeMetadata);
    const userRole = parsedUser.success ? parsedUser.data.role : "patient";

    return (
        <Sidebar variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-white">
                                    <HeartHandshake className="size-6" />
                                </div>
                                <div className="grid flex-1 text-left">
                                    <span className={"truncate font-semibold text-primary"}>
                                        BetterHealth
                                    </span>
                                    <span className="truncate text-xs">
                                        {userRole === "patient" ? "Member" : "Therapist"}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={appUser} />
            </SidebarFooter>
        </Sidebar>
    );
}
