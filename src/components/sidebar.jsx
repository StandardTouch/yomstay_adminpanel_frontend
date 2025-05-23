import React, { useEffect } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  ProSidebarProvider,
  sidebarClasses,
} from "react-pro-sidebar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";
import { CgEnter } from "react-icons/cg";

function Sidebaar() {
  const { collapseSidebar, collapsed } = useProSidebar();

  // Automatically collapse sidebar on screens narrower than 500px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        collapseSidebar(true);
      } else {
        collapseSidebar(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [collapseSidebar]);

  return (
    <div className="flex  h-[100vh]">
      <Sidebar
         
        collapsed={collapsed}
        collapsedWidth="80px"
        width="250px"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#FFFBDE",
            
          },
        }}
      >
        {/* Custom Sidebar Header */}
        <div
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: collapsed ? "center" : "space-between",
            alignItems: "center",
          
          }}
        >
          {!collapsed && (
            <h2 style={{ margin: 0, fontSize: "1.2rem", textAlign: "center" }}>
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => collapseSidebar()}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <Menu
          menuItemStyles={{
            button: {
              color: "#333",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            },
          }}
        >
          <MenuItem icon={<DiAndroid />}>Documentation</MenuItem>
          <MenuItem>Calendar</MenuItem>
          <MenuItem>E-commerce</MenuItem>
          <MenuItem>Calendar</MenuItem>
          <MenuItem>E-commerce</MenuItem> <MenuItem>Calendar</MenuItem>
          <MenuItem>E-commerce</MenuItem> <MenuItem>Calendar</MenuItem>
          <MenuItem>E-commerce</MenuItem> <MenuItem>Calendar</MenuItem>
          <MenuItem>E-commerce</MenuItem> <MenuItem>Calendar</MenuItem>
          <MenuItem>E-commerce</MenuItem>
          {/* Add more MenuItems as needed */}
        </Menu>
      </Sidebar>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>
        <h1>{collapsed ? "Sidebar Collapsed" : "Sidebar Expanded"}</h1>
        <p>Main content goes here.</p>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ProSidebarProvider>
      <Sidebaar />
    </ProSidebarProvider>
  );
}
