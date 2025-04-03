import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AddRooms() {
  const [formData, setFormData] = useState({ room_no: "", branch: "", is_lab: false });

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/rooms/", formData);
      alert("Room added successfully!");
      setFormData({ room_no: "", branch: "", is_lab: false });
    } catch (error) {
      alert("Error adding room. Please try again.");
      console.error(error);
    }
  };

  // Animation for form fields
  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2 },
        },
      }}
    >
      {/* Room No */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Room No</label>
        <input
          name="room_no"
          value={formData.room_no}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Branch */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Branch</label>
        <input
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Is Lab Checkbox */}
      <motion.div variants={fieldVariants}>
        <label className="flex items-center text-gray-700 font-medium">
          <input
            name="is_lab"
            type="checkbox"
            checked={formData.is_lab}
            onChange={handleChange}
            className="mr-2 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          Is Lab?
        </label>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={fieldVariants}>
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Add Room
        </button>
      </motion.div>
    </motion.form>
  );
}

export default AddRooms;

// import React, { useState } from "react";
// import axios from "axios";

// function AddRooms() {
//   const [formData, setFormData] = useState({ room_no: "", branch: "", is_lab: false });

//   const handleChange = (e) => {
//     const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
//     setFormData({ ...formData, [e.target.name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:8000/api/rooms/", formData);
//     alert("Room added!");
//     setFormData({ room_no: "", branch: "", is_lab: false });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
//       <div>
//         <label className="block text-gray-700">Room No</label>
//         <input name="room_no" value={formData.room_no} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <div>
//         <label className="block text-gray-700">Branch</label>
//         <input name="branch" value={formData.branch} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <div>
//         <label className="flex items-center text-gray-700">
//           <input name="is_lab" type="checkbox" checked={formData.is_lab} onChange={handleChange} className="mr-2" />
//           Is Lab?
//         </label>
//       </div>
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">Add Room</button>
//     </form>
//   );
// }

// export default AddRooms;