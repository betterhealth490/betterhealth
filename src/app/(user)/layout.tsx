import { cookies } from "next/headers";
import { AppSidebar } from "~/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Breadcrumbs } from "~/components/user/breadcrumbs";

export default function UserLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const cookieStore = cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
                <Breadcrumbs />
                <div className="h-full p-4">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
