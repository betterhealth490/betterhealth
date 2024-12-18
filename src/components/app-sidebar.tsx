"use client";

import * as React from "react";
import { Book, Calendar, HeartHandshake, Inbox } from "lucide-react";

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
import { LayoutDashboard } from "lucide-react";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) {
    return null;
  }
  const appUser = {
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    username: user.username ?? undefined,
    email: user.emailAddresses[0]?.emailAddress ?? undefined,
    imageUrl: user.imageUrl ?? undefined,
  };
  const role = user.unsafeMetadata.role as "therapist" | "member";

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

  return (
    <Sidebar collapsible="icon" {...props}>
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
                    {role === "member" ? "Member" : "Therapist"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            role === "member"
              ? data
              : data.filter((item) => item.url !== "/journal")
          }
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={appUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
