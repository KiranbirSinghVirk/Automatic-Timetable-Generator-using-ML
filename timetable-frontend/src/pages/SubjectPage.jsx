import React from "react";
import AddSubject from "../components/AddSubject";

function SubjectPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Add Subjects</h1>
      <AddSubject />
    </div>
  );
}

export default SubjectPage;