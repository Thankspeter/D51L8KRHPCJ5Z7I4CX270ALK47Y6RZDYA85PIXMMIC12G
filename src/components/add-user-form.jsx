"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  apikey: z.string().min(5, {
    message: "API Key must be at least 5 characters.",
  }),
});

export function AddUserForm({ setClients, generateApikey }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      apikey: "",
    },
  });

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

      // Fetch updated clients list
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/client/read`);
      setClients(response.data);
    } catch (error) {
      console.error("Error adding client:", error);
      form.setError("username", { message: error.response?.data || "An error occurred." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold">Add User</h2>

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

        <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
          Add User
        </Button>
      </form>
    </Form>
  );
}