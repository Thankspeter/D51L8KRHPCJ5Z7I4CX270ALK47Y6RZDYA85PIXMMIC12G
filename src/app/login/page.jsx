"use client";

import LoginForm from "@/components/login-form"; // Correct import (assuming default export)
import { useState } from "react"; // Add state management
import Image from "next/image"; // Import Next.js Image component

export default function LoginPage() {
  const [token, setToken] = useState(""); // State for managing token

  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          {/* Replace the icon with your logo */}
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <Image
              src="./logo.jpg" // Referencing logo.jpg from the public folder
              alt="" // Alternative text for accessibility
              width={24} // Adjust width to match your design
              height={24} // Adjust height to match your design
              className="rounded-md"
            />
          </div>
          Sagator
        </a>
        <LoginForm setToken={setToken} /> {/* Pass setToken to LoginForm */}
      </div>
    </div>
  );
}