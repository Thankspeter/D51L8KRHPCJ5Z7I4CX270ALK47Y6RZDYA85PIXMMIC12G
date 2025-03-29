"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  apikey: z.string().length(32, {
    message: "API Key must be 32 characters.",
  }),
});

export default function AddUserForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      apikey: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState(""); // Track success messages
  const [errorMessage, setErrorMessage] = useState(""); // Track error messages

  // Generate a random API key and set it in the input field
  const generateApikey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    form.setValue("apikey", key); // Update the API key field
    setErrorMessage(""); 
    setTimeout(() => setErrorMessage(""), 3000); 
  };

  const onSubmit = async (data) => {
    const { username, apikey } = data;
    try {
      // API call to create a new client
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/client/create`, {
        username,
        apikey,
      });

      // Reset form fields after submission
      form.reset();

      // Display success message
      setSuccessMessage("User added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); 
      setErrorMessage(""); // Clear any error message
      setTimeout(() => setErrorMessage(""), 3000); 
    } catch (error) {
      setErrorMessage(error.response.data);
      setTimeout(() => setErrorMessage(""), 3000); 
      setSuccessMessage(""); // Clear any success message
      setTimeout(() => setSuccessMessage(""), 3000); 
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold">Add User</h2>

        {/* Display Success and Error Messages */}
        {successMessage && (
          <p className="text-green-500">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500">{errorMessage}</p>
        )}

        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* API Key Field */}
        <FormField
          control={form.control}
          name="apikey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <div className="flex flex-row gap-2">
                  <Input placeholder="Enter API key" {...field} />
                  <Button type="button" onClick={generateApikey}>
                    Generate
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
        >
          Add User
        </Button>
      </form>
    </Form>
  );
}