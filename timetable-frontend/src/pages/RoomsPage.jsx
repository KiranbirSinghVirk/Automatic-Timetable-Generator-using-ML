import React from "react";
import AddRooms from "../components/AddRooms";

function RoomsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Add Rooms</h1>
      <AddRooms />
    </div>
  );
}

export default RoomsPage;