"use client";

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure you install this package: npm install jwt-decode
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Sagator from "@/components/dashboard/sagator/page";
import SecondProject from "@/components/dashboard/secondproject/page";
import ThirdProject from "@/components/dashboard/thirdproject/page";
import SettingsPage from "@/components/dashboard/settings/page";

export default function Page() {
  const [activeSection, setActiveSection] = useState("sagator"); // Default section is Project 1
  const [isCollapsed, setIsCollapsed] = useState(false); // Manage the sidebar collapsed state
  const [isTokenValid, setIsTokenValid] = useState(false); // Token validity state
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering prematurely

  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken); // Decode the token
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp < currentTime) {
            // If token is expired, clear it
            localStorage.removeItem("token");
            setIsTokenValid(false);
          } else {
            // If token is valid, allow rendering
            setIsTokenValid(true);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          setIsTokenValid(false);
        }
      } else {
        setIsTokenValid(false); // No token found
      }
      setLoading(false); // Validation complete
    };

    validateToken();
  }, []);

  // Redirect to login if token is invalid
  useEffect(() => {
    if (!loading && !isTokenValid) {
      window.location.href = "/login"; // Redirect to login
    }
  }, [loading, isTokenValid]);

  // Map activeSection to display names for the breadcrumb
  const sectionNames = {
    sagator: "Sagator Gen V1",
    secondproject: "Second Project Coming...",
    thirdproject: "Third Project Coming...",
    settings: "Settings",
  };

  // Render content dynamically based on activeSection
  const renderActiveContent = () => {
    switch (activeSection) {
      case "sagator":
        return <Sagator />;
      case "secondproject":
        return <SecondProject />;
      case "thirdproject":
        return <ThirdProject />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Sagator />; // Default fallback
    }
  };

  if (loading) {
    return null; // Placeholder while validating token
  }
  
  if (!isTokenValid) {
    return (
      <div
        className="flex items-center justify-center h-screen font-bold text-xl text-red-600"
      >
        You’re not authorized, please login.
      </div>
    );
  }
  

  // Render the dashboard only if the token is valid
  if (isTokenValid) {
    return (
      <SidebarProvider>
        <AppSidebar
          setActiveSection={setActiveSection}
          isCollapsed={isCollapsed} // Pass the state to AppSidebar
          setIsCollapsed={setIsCollapsed} // Allow the AppSidebar to control collapsing
        />
        <SidebarInset>
          <header
            className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          >
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger
                className="-ml-1"
                onClick={() => setIsCollapsed(!isCollapsed)} // Toggle collapsed state
              />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    {/* Display the name of the active section */}
                    {sectionNames[activeSection]}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {renderActiveContent()}
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback (this case won't likely trigger due to redirect above)
  return null;
}