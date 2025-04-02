import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-all duration-300">
          Timetable Generator
        </Link>
        <div className="space-x-6">
          <Link to="/faculty" className="text-white hover:text-gray-200 transition-colors duration-300">Add Faculty</Link>
          <Link to="/subjects" className="text-white hover:text-gray-200 transition-colors duration-300">Add Subjects</Link>
          <Link to="/rooms" className="text-white hover:text-gray-200 transition-colors duration-300">Add Rooms</Link>
          <Link to="/assignments" className="text-white hover:text-gray-200 transition-colors duration-300">Faculty Assignment</Link>
          <Link to="/generate" className="text-white hover:text-gray-200 transition-colors duration-300">Generate</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;