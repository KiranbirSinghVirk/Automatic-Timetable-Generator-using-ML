import React from "react";
import FacultyAssignment from "../components/FacultyAssignment";

function AssignmentPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Faculty Assignment</h1>
      <FacultyAssignment />
    </div>
  );
}

export default AssignmentPage;