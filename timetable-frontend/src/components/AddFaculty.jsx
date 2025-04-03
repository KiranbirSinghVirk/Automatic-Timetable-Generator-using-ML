import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AddFaculty() {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    phone_no: "",
    email: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/faculty/", formData);
      alert("Faculty added successfully!");
      setFormData({ employee_id: "", name: "", phone_no: "", email: "" });
    } catch (error) {
      alert("Error adding faculty. Please try again.");
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
      {/* Employee ID */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Employee ID</label>
        <input
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Name */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Phone Number */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
        <input
          name="phone_no"
          value={formData.phone_no}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Email */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={fieldVariants}>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Add Faculty
        </button>
      </motion.div>
    </motion.form>
  );
}

export default AddFaculty;

// import React, { useState } from "react";
// import axios from "axios";

// function AddSubject() {
//   const [formData, setFormData] = useState({ subject_code: "", subject_name: "", department: "" });

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:8000/api/subjects/", formData);
//     alert("Subject added!");
//     setFormData({ subject_code: "", subject_name: "", department: "" });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
//       <div>
//         <label className="block text-gray-700">Subject Code</label>
//         <input name="subject_code" value={formData.subject_code} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <div>
//         <label className="block text-gray-700">Subject Name</label>
//         <input name="subject_name" value={formData.subject_name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <div>
//         <label className="block text-gray-700">Department</label>
//         <input name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">Add Subject</button>
//     </form>
//   );
// }

// export default AddSubject;