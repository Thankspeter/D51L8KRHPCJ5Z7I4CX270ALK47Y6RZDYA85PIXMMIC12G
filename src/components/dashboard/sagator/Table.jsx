"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";

export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10); // Adjust as needed
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // ** Auto-refresh logic to keep the server awake silently **
  useEffect(() => {
    let requestCount = 0;

    // Fetch clients silently
    const autoFetchClients = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/client/read`);
        // No GUI updates or console logs
      } catch (error) {
        // Silently handle errors
      }
    };

    // Generate random interval in milliseconds
    const getRandomInterval = (min, max) =>
      Math.floor(Math.random() * (max - min + 1) + min) * 60000;

    // Main function to control the auto-refresh
    const startAutoFetch = async () => {
      if (requestCount < 3) {
        await autoFetchClients();
        requestCount += 1;

        // Post the next request within 4 to 9 minutes
        const interval = getRandomInterval(4, 9);
        setTimeout(startAutoFetch, interval);
      } else {
        // After completing 3 requests, rest for 5 to 7 minutes
        requestCount = 0; // Reset request count
        const restInterval = getRandomInterval(5, 7);
        setTimeout(startAutoFetch, restInterval);
      }
    };

    // Start the auto-fetch loop
    startAutoFetch();
  }, []);

  // Fetch clients on initial load
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/client/read`
        );
        setClients(response.data);
      } catch (err) {
        setError("Failed to fetch clients.");
        setTimeout(() => setError(""), 3000);
      }
    };
    fetchClients();
  }, []);

  // Filter and paginate clients
  const filteredClients = clients.filter((client) =>
    client.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page after searching
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredClients.length / clientsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (client) => {
    setSelectedClient(client); // Open the edit form with client data
    setSuccessMessage(""); // Clear previous success messages
    setTimeout(() => setSuccessMessage(""), 3000);
    setError(""); // Clear previous error messages
    setTimeout(() => setError(""), 3000);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/client/update`, {
        id: selectedClient.id,
        username: selectedClient.username,
        apikey: selectedClient.apikey,
      });

      // Update client list after successful update
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/client/read`
      );
      setClients(response.data);

      // Display success message and close form
      setSuccessMessage("Client updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setSelectedClient(null);
    } catch (error) {
      setError("Failed to update client.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/client/delete`, {
        data: { id },
      });
      setClients(clients.filter((client) => client.id !== id));
      setSuccessMessage("Client deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete client.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const refreshClients = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/client/read`
      );
      setClients(response.data);
      setSuccessMessage("Client list updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error refreshing clients:", err);
      setError("Failed to refresh client list.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div>
        <Label className="flex justify-center items-center font-bold border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
        Total Users: {filteredClients.length}
        </Label>
      {error && <p className="flex justify-center items-center text-red-500 mt-4">{error}</p>}
      {successMessage && <p className="flex justify-center items-center text-green-500 mt-4">{successMessage}</p>}
      <DropdownMenuSeparator />
        <div className="flex justify-center items-center">
            <Button type="button" onClick={refreshClients}>
                Refresh
            </Button>
        </div>
      <DropdownMenuSeparator />
      <DropdownMenuSeparator />
      <Input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30px]">ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Apikey</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentClients.map((client, index) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                {index + 1 + (currentPage - 1) * clientsPerPage}
              </TableCell>
              <TableCell>{client.username}</TableCell>
              <TableCell>{client.apikey}</TableCell>
              <TableCell>{client.uuid}</TableCell>
              <TableCell>{client.device_active ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(client)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(client.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={prevPage} />
          </PaginationItem>
          {[...Array(Math.ceil(filteredClients.length / clientsPerPage))].map(
            (_, pageNumber) => (
              <PaginationItem key={pageNumber + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(pageNumber + 1)}
                  isActive={currentPage === pageNumber + 1}
                >
                  {pageNumber + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext onClick={nextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Edit Form Popup */}
      {selectedClient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Client</h2>
            <form onSubmit={handleUpdateClient}>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <div className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    value={selectedClient.username}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        username: e.target.value,
                      })
                    }
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input
                    value={selectedClient.apikey}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        apikey: e.target.value,
                      })
                    }
                    placeholder="Enter API key"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white hover:bg-blue-600 mt-4"
              >
                Update
              </Button>
              <Button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="w-full bg-gray-500 text-white hover:bg-gray-600 mt-4"
              >
                Cancel
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}