import React from "react";
import AddFaculty from "../components/AddFaculty";

function FacultyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Add Faculty</h1>
      <AddFaculty />
    </div>
  );
}

export default FacultyPage;