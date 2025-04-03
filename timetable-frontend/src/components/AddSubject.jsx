import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AddSubject() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Theory");
  const [slots, setSlots] = useState(4);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "type") setType(value);
    else if (name === "slots") setSlots(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/subjects", { name, type, slots });
      alert("Subject added successfully!");
      setName("");
      setType("Theory");
      setSlots(4);
    } catch (error) {
      alert("Error adding subject. Please try again.");
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
      {/* Subject Name */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Subject Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Type */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Type</label>
        <select
          name="type"
          value={type}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
        >
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>
      </motion.div>

      {/* Slots */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Slots</label>
        <input
          type="number"
          name="slots"
          value={slots}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          min="1"
          required
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={fieldVariants}>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Add Subject
        </button>
      </motion.div>
    </motion.form>
  );
}

export default AddSubject;

// import React, { useState } from "react";
// import axios from "axios";

// function AddSubject() {
//   const [name, setName] = useState("");
//   const [type, setType] = useState("Theory");
//   const [slots, setSlots] = useState(4);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:8000/api/subjects", { name, type, slots });
//     alert("Subject added!");
//     setName("");
//     setType("Theory");
//     setSlots(4);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
//       <div>
//         <label className="block text-gray-700">Subject Name</label>
//         <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <div>
//         <label className="block text-gray-700">Type</label>
//         <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded-lg">
//           <option value="Theory">Theory</option>
//           <option value="Lab">Lab</option>
//         </select>
//       </div>
//       <div>
//         <label className="block text-gray-700">Slots</label>
//         <input type="number" value={slots} onChange={(e) => setSlots(e.target.value)} className="w-full p-2 border rounded-lg" min="1" required />
//       </div>
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">
//         Add Subject
//       </button>
//     </form>
//   );
// }

// export default AddSubject;