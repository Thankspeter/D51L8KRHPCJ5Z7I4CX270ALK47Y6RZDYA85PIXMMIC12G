"use client";

export default function AddUserForm() {
  return (
    <form className="space-y-4">
      <h2 className="text-xl font-bold">Project 3 - Add User</h2>
      <input
        type="text"
        placeholder="Enter username"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
}