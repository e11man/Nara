// app/main/layout.tsx
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/blocks/sidebar";
import Link from "next/link";
import { Home, Users, FileText } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="light">
    <SidebarProvider>
        <Sidebar className="bg-white border-r border-gray-200">
          <SidebarHeader className="bg-white border-b border-gray-200">
          <div className="px-4 py-2">
              <h2 className="text-lg font-semibold text-gray-900">HR Onboarding</h2>
          </div>
        </SidebarHeader>
          <SidebarContent className="bg-white">
          <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <Link href="/main/dashboard">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <Link href="/main/employees">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Employees</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                    <Link href="/main/templates">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Templates</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
        <SidebarInset className="bg-white">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4 bg-white">
            <SidebarTrigger className="text-gray-700 hover:bg-gray-100" />
          <div className="flex-1" />
          {/* Add user menu, theme switcher, etc here */}
        </header>
          <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}