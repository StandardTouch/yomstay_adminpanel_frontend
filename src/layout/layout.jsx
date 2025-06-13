import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Component } from "../components/card";
import { Piecard } from "../components/pie-card";
import { UserButton } from "@clerk/clerk-react";
import { FaBars } from "react-icons/fa6";
import { useSidebar } from "../components/ui/sidebar";
import { Outlet } from "react-router-dom";

function InnerLayout({ children }) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div className="w-screen flex bg-white">
      <AppSidebar />
      <main className="w-full ">
        {/* Header - place inside main, no fixed, so it doesn't overlap sidebar */}
        <div className="h-14 px-4  flex items-center justify-between bg-white w-full text-3xl text-center text-black">
          <div>
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded hover:bg-gray-300 focus:outline-none focus:ring"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
          <div>Admin Panel</div>
          <div>
            <UserButton />
          </div>
        </div>

        <div className="flex pt-4 flex-col gap-4 sm:flex-row px-4">
          {/* Render nested route content here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <InnerLayout>{children}</InnerLayout>
    </SidebarProvider>
  );
}
