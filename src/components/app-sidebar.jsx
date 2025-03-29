import React, { useEffect, useState } from "react";
import {
  ComputerIcon,
  Settings2,
  Laptop,
  LogOut,
  Indent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ setActiveSection }) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar(); // Extract mobile state management


  const data = {
    navMain: [
      { title: "Sagator", section: "sagator", icon: Laptop },
      { title: "Project 2", section: "secondproject", icon: Indent },
      { title: "Project 3", section: "thirdproject", icon: ComputerIcon },
      { title: "Settings", section: "settings", icon: Settings2 },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminName"); // Clear admin name on logout
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
      </SidebarHeader>

      <SidebarContent className="p-4"> {/* Added padding to SidebarContent */}
        <ul className="space-y-4">
          {data.navMain.map((item) => (
            <li key={item.section}>
              <button
                className="flex items-center space-x-2 text-gray-800"
                onClick={() => {
                  setActiveSection(item.section); // Change active section
                  if (isMobile) {
                    setOpenMobile(false); // Close sidebar on mobile
                  }
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </SidebarContent>

      <SidebarFooter className="p-4"> {/* Added padding to SidebarFooter */}
        <Button
          type="button"
          onClick={handleLogout}
          className="flex items-center space-x-2" // Added padding to Logout button
        >
          <LogOut />
          <span>Logout</span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}