import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  Home,
  Hotel,
  Inbox,
  Search,
  Settings,
  SlidersHorizontal,
  User,
  Building2,
  Building,
  Banknote,
  FileCog,
  FileText,
  ListTodo,
  Newspaper,
  SwatchBook,
  Contact,
} from "lucide-react";
import { FaHotel } from "react-icons/fa6";
import { useTheme } from "next-themes";

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

// Grouped sidebar items for scalability
const sidebarGroups = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Users", url: "users", icon: User },
      { title: "Bookings", url: "booking", icon: Calendar },
      { title: "Support Requests", url: "support_request", icon: FileCog },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Hotels", url: "hotels", icon: Hotel },
      { title: "Hotel Requests", url: "hotel_requests", icon: FileText },

      { title: "Amenities", url: "amenities", icon: Inbox },
      { title: "Filter", url: "filter", icon: SlidersHorizontal },
      { title: "Conditions", url: "conditions", icon: ListTodo },
      { title: "Themes", url: "theme", icon: SwatchBook },
      { title: "Newsletter", url: "newsletter", icon: Newspaper },
      { title: "Contact Request", url: "contact_request", icon: Contact },
    ],
  },
  {
    label: "General",
    items: [{ title: "Settings", url: "settings", icon: Settings },
    { title: "Currency Conversion", url: "currency_conversion", icon: Banknote },
    { title: "Countries", url: "countries", icon: Building2 },
    { title: "Cities", url: "cities", icon: Building },
    { title: "States", url: "states", icon: Building }
    ],
  },
  // Add more groups here as needed
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
  const { resolvedTheme } = useTheme();

  // When on mobile, ensure sidebar is open by default
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  // Select logo based on theme
  let logoSrc = "/logo.png";
  if (resolvedTheme === "dark") logoSrc = "/logo_white.png";
  else if (resolvedTheme === "light") logoSrc = "/logo_black.png";

  let smallLogoSrc = "/logo_small.png";
  if (resolvedTheme === "dark") smallLogoSrc = "/logo_small_white.png";
  else if (resolvedTheme === "light") smallLogoSrc = "/logo_small_black.png";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-[hsl(var(--sidebar-background))] border-r border-[--color-navyblue] text-black dark:text-white min-h-screen">
        {/* sidebar header  */}
        <SidebarHeader
          className={`flex items-center space-x-2 ${
            open ? "px-3 py-2" : "px-2"
          }`}
        >
          {open ? (
            <img src={logoSrc} alt="Logo" className="w-full" />
          ) : (
            <img src={smallLogoSrc} alt="Logo Small" className="w-6 pt-1" />
          )}
          {/* {open && <span className="whitespace-nowrap font-bold">Yomstay</span>} */}
        </SidebarHeader>

        {/* Render sidebar groups dynamically */}
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[--color-navyblue] dark:text-[--color-navyblue] opacity-80">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent
              className={`${open ? "border-l-4 border-transparent" : ""}`}
            >
              <SidebarMenu
                className={`${!open ? "items-center justify-center" : ""}`}
              >
                {group.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={openMobile ? () => setOpenMobile(false) : null}
                  >
                    <SidebarMenuButton
                      asChild
                      className={`p-0 ${
                        !open ? "flex flex-col items-center justify-center" : ""
                      }`}
                    >
                      <NavLink
                        to={item.url}
                        {...(item.url === "/dashboard" ? { end: true } : {})}
                        className={({ isActive }) =>
                          `flex items-center gap-2 w-full px-2 py-2 rounded transition-all duration-200 text-black dark:text-white hover:bg-[--color-navyblue-light] dark:hover:bg-[--color-navyblue-dark]/40 hover:text-[--color-navyblue] dark:hover:text-[--color-navyblue] ${
                            isActive
                              ? "bg-[--color-navyblue-light] dark:bg-[--color-navyblue-dark]/60 text-[--color-navyblue] dark:text-[--color-navyblue] font-bold border-[--color-navyblue] shadow"
                              : ""
                          } ${!open ? "justify-center" : ""}`
                        }
                      >
                        <item.icon className={`${!open ? "text-2xl" : ""}`} />
                        <span className={`${!open ? "hidden" : ""}`}>
                          {item.title}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
