import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Home,
  Hotel,
  Inbox,
  Search,
  Settings,
  User,
} from "lucide-react";
import { FaHotel } from "react-icons/fa6";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarHeader, useSidebar } from "./ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "users",
    icon: User,
  },
  {
    title: "Hotels",
    url: "hotels",
    icon: Hotel,
  },
];

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  // When on mobile, ensure sidebar is open by default
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(true);
    }
  }, [isMobile, setOpenMobile]);
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* sidebar header  */}
        <SidebarHeader className="flex items-center space-x-2 px-3 py-2 text-white">
          {open ? (
            <img src="/logo.png" alt="Logo" className="w-full" />
          ) : (
            <img src="/logo_small.png" alt="Logo Small" className="w-8 h-8" />
          )}
          {/* {open && <span className="whitespace-nowrap font-bold">Yomstay</span>} */}
        </SidebarHeader>

        {/* other group */}
        <SidebarGroup>
          {/* <SidebarGroupLabel className="text-white">
            Application
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-white p-0">
                    <NavLink
                      to={item.url}
                      {...(item.url === "/dashboard" ? { end: true } : {})}
                      className={({ isActive }) => {
                        console.log(
                          item.title,
                          item.url,
                          isActive,
                          window.location.pathname
                        );
                        return `flex items-center gap-2 w-full px-2 py-2 rounded transition-all duration-200 border-l-4 ${
                          isActive
                            ? "bg-red-500 text-white font-bold border-navyblue shadow"
                            : "text-yellow-500 border-transparent hover:bg-white/10"
                        }`;
                      }}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
