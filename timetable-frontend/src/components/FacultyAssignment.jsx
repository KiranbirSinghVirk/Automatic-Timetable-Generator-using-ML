import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function FacultyAssignment() {
  const [formData, setFormData] = useState({
    employee_id: "",
    faculty_name: "",
    subject: "",
    branch: "",
  });
  const [facultyList, setFacultyList] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/faculty/")
      .then((res) => setFacultyList(res.data))
      .catch((error) => console.error("Error fetching faculty:", error));
    axios
      .get("http://localhost:8000/api/subjects/")
      .then((res) => setSubjects(res.data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/assignments/", formData);
      alert("Assignment added successfully!");
      setFormData({ employee_id: "", faculty_name: "", subject: "", branch: "" });
    } catch (error) {
      alert("Error adding assignment. Please try again.");
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
        <select
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
          required
        >
          <option value="">Select Faculty</option>
          {facultyList.map((f) => (
            <option key={f.employee_id} value={f.employee_id}>
              {f.name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Faculty Name */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Faculty Name</label>
        <input
          name="faculty_name"
          value={formData.faculty_name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Subject */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Subject</label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.subject_code} value={s.subject_code}>
              {s.subject_name}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Branch */}
      <motion.div variants={fieldVariants}>
        <label className="block text-gray-700 font-medium mb-1">Branch</label>
        <input
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
          required
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={fieldVariants}>
        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
        >
          Assign Faculty
        </button>
      </motion.div>
    </motion.form>
  );
}

export default FacultyAssignment;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function FacultyAssignment() {
//   const [formData, setFormData] = useState({ employee_id: "", faculty_name: "", subject: "", branch: "" });
//   const [facultyList, setFacultyList] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:8000/api/faculty/").then((res) => setFacultyList(res.data));
//     axios.get("http://localhost:8000/api/subjects/").then((res) => setSubjects(res.data));
//   }, []);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:8000/api/assignments/", formData);
//     alert("Assignment added!");
//     setFormData({ employee_id: "", faculty_name: "", subject: "", branch: "" });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
//       <div>
//         <label className="block text-gray-700">Employee ID</label>
//         <select name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
//           <option value="">Select Faculty</option>
//           {facultyList.map((f) => (
//             <option key={f.employee_id} value={f.employee_id}>{f.name}</option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label className="block text-gray-700">Faculty Name</label>
//         <input name="faculty_name" value={formData.faculty_name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <div>
//         <label className="block text-gray-700">Subject</label>
//         <select name="subject" value={formData.subject} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
//           <option value="">Select Subject</option>
//           {subjects.map((s) => (
//             <option key={s.subject_code} value={s.subject_code}>{s.subject_name}</option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label className="block text-gray-700">Branch</label>
//         <input name="branch" value={formData.branch} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
//       </div>
//       <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300">Assign Faculty</button>
//     </form>
//   );
// }

// export default FacultyAssignment;