import React, { useState } from "react";
import axios from "axios";

function AddRooms() {
  const [formData, setFormData] = useState({ room_no: "", branch: "", is_lab: false });

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/rooms/", formData);
    alert("Room added!");
    setFormData({ room_no: "", branch: "", is_lab: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-gray-700">Room No</label>
        <input name="room_no" value={formData.room_no} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-gray-700">Branch</label>
        <input name="branch" value={formData.branch} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
      </div>
      <div>
        <label className="flex items-center text-gray-700">
          <input name="is_lab" type="checkbox" checked={formData.is_lab} onChange={handleChange} className="mr-2" />
          Is Lab?
        </label>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">Add Room</button>
    </form>
  );
}

export default AddRooms;