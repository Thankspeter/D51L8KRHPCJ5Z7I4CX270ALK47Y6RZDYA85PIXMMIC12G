"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // Ensure this is correctly imported

function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken); // Use jwtDecode here
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token"); // Remove expired token
          router.push("/login"); // Redirect to login page
        } else {
          router.push("/dashboard"); // Redirect to dashboard
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token"); // Clear invalid token
        router.push("/login"); // Redirect to login page
      }
    } else {
      router.push("/login"); // No token found, redirect to login page
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to Acme Inc.</h1>
      <p>Redirecting...</p>
    </div>
  );
}

export default Home;