"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminUpdateForm() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword.length < 8) {
      setError("The new password must be at least 8 characters long.");
      return;
    }

    setLoading(true); // Start loading

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/profile/update`,
        {
          username,
          newPassword,
          currentPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      setSuccess("Profile updated successfully!");
      
      // Reset form fields after a successful response
      setUsername("");
      setCurrentPassword("");
      setNewPassword("");

      setTimeout(() => setSuccess(""), 3000); 

    } catch (error) {
        setError(error.response.data);
        setTimeout(() => setError(""), 3000);
         
      }
      setLoading(false); 
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Update Profile</CardTitle>
          {error && (
            <CardDescription className="text-red-500 mb-4">{error}</CardDescription>
          )}
          {success && (
            <CardDescription className="text-green-500 mb-4">{success}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Username Field */}
              <div className="grid gap-3">
                <Label htmlFor="username">New Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter new username"
                  required
                />
              </div>

                {/* New Password Field */}
              <div className="grid gap-3">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                />
              </div>

              {/* Current Password Field */}
              <div className="grid gap-3">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}