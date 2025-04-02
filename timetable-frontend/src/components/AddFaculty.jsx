import React, { useState } from "react";
import axios from "axios";

function AddSubject() {
  const [formData, setFormData] = useState({ subject_code: "", subject_name: "", department: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/subjects/", formData);
    alert("Subject added!");
    setFormData({ subject_code: "", subject_name: "", department: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-gray-700">Subject Code</label>
        <input name="subject_code" value={formData.subject_code} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-gray-700">Subject Name</label>
        <input name="subject_name" value={formData.subject_name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-gray-700">Department</label>
        <input name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">Add Subject</button>
    </form>
  );
}

export default AddSubject;