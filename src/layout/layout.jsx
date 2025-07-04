import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Component } from "../components/card";
import { Piecard } from "../components/pie-card";
import { UserButton } from "@clerk/clerk-react";
import { FaBars } from "react-icons/fa6";
import { useSidebar } from "../components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header fixed>
          <div className="flex min-w-[80%] items-center justify-between gap-4 px-2 sm:px-6">
            <Breadcrumbs />
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserButton />
            </div>
          </div>
        </Header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Render nested route content here */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
