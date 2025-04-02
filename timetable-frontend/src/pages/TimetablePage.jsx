import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
        Welcome to Timetable Pro
      </h1>
      <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-200">
        Organize and view your class schedules with ease. Explore branch-wise
        timetables in a professional and intuitive interface.
      </p>
      <Link
        to="/timetable"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        View Timetable
      </Link>
    </div>
  );
}

export default Home;