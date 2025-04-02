import React, { useState, useEffect } from "react";
import axios from "axios";
import TimetableDisplay from "../components/TimetableDisplay";

function GeneratePage() {
  const [department, setDepartment] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/subjects/").then((res) => {
      const uniqueDepartments = [...new Set(res.data.map((s) => s.department))];
      setDepartments(uniqueDepartments);
    });
  }, []);

  const handleGenerate = async () => {
    const res = await axios.post("http://localhost:8000/api/generate/", { department });
    setTimetable(res.data);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Generate Timetable</h1>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Select Department</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full max-w-xs p-2 border rounded-lg"
        >
          <option value="">Select Department</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 mb-6"
        disabled={!department}
      >
        Generate Timetable
      </button>
      {timetable.length > 0 && <TimetableDisplay timetableData={timetable} />}
    </div>
  );
}

export default GeneratePage;