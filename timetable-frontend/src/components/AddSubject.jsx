import React, { useState } from "react";
import axios from "axios";

function AddSubject() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Theory");
  const [slots, setSlots] = useState(4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/subjects", { name, type, slots });
    alert("Subject added!");
    setName("");
    setType("Theory");
    setSlots(4);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-gray-700">Subject Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" required />
      </div>
      <div>
        <label className="block text-gray-700">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded-lg">
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700">Slots</label>
        <input type="number" value={slots} onChange={(e) => setSlots(e.target.value)} className="w-full p-2 border rounded-lg" min="1" required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">
        Add Subject
      </button>
    </form>
  );
}

export default AddSubject;