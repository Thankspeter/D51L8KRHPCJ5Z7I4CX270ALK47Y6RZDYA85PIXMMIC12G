import React, { useState } from "react";
import AddUserForm from "./Form";
import ClientTable from "./Table";

export default function Sagator() {
  const [clients] = useState([]);
  

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Center AddUserForm */}
      <div className="flex justify-center items-center min-h-[50vh]">
        <AddUserForm className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      {/* Table Section */}
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <ClientTable clients={clients} />
      </div>
    </div>
  );
}