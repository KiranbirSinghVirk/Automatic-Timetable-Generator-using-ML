import React from "react";

function Home() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">Automatic Timetable Generator</h1>
      <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-200">
        Add faculty, subjects, rooms, and assignments, then generate your department's timetable.
      </p>
    </div>
  );
}

export default Home;