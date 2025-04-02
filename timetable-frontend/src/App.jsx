import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FacultyPage from "./pages/FacultyPage";
import SubjectPage from "./pages/SubjectPage";
import RoomsPage from "./pages/RoomsPage";
import AssignmentPage from "./pages/AssignmentPage";
import GeneratePage from "./pages/GeneratePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/subjects" element={<SubjectPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/assignments" element={<AssignmentPage />} />
        <Route path="/generate" element={<GeneratePage />} />
      </Routes>
    </div>
  );
}

export default App;