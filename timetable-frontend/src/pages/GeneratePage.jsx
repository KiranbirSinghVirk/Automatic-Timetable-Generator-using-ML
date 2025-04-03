import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import TimetableDisplay from "../components/TimetableDisplay";

function GeneratePage() {
  const [department, setDepartment] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/subjects/")
      .then((res) => {
        const uniqueDepartments = [...new Set(res.data.map((s) => s.department))];
        setDepartments(uniqueDepartments);
      })
      .catch((error) => console.error("Error fetching departments:", error));
  }, []);

  const handleGenerate = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/generate/", { department });
      setTimetable(res.data);
    } catch (error) {
      alert("Error generating timetable. Please try again.");
      console.error(error);
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between child animations
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="container mx-auto py-16 px-4 bg-gradient-to-b from-teal-50 to-white min-h-screen">
      {/* Header with animation */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Generate Timetable
      </motion.h1>

      {/* Introduction with animation */}
      <motion.p
        className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Generate an optimized timetable for your department by selecting it below and clicking generate.
      </motion.p>

      {/* Form Section */}
      <motion.div
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Select Department</label>
          <motion.select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </motion.select>
        </div>
        <motion.button
          onClick={handleGenerate}
          className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!department}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          Generate Timetable
        </motion.button>
      </motion.div>

      {/* Timetable Display */}
      {timetable.length > 0 && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <TimetableDisplay timetableData={timetable} />
        </motion.div>
      )}
    </div>
  );
}

export default GeneratePage;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import TimetableDisplay from "../components/TimetableDisplay";

// function GeneratePage() {
//   const [department, setDepartment] = useState("");
//   const [timetable, setTimetable] = useState([]);
//   const [departments, setDepartments] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:8000/api/subjects/").then((res) => {
//       const uniqueDepartments = [...new Set(res.data.map((s) => s.department))];
//       setDepartments(uniqueDepartments);
//     });
//   }, []);

//   const handleGenerate = async () => {
//     const res = await axios.post("http://localhost:8000/api/generate/", { department });
//     setTimetable(res.data);
//   };

//   return (
//     <div className="container mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Generate Timetable</h1>
//       <div className="mb-6">
//         <label className="block text-gray-700 mb-2">Select Department</label>
//         <select
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//           className="w-full max-w-xs p-2 border rounded-lg"
//         >
//           <option value="">Select Department</option>
//           {departments.map((dep) => (
//             <option key={dep} value={dep}>{dep}</option>
//           ))}
//         </select>
//       </div>
//       <button
//         onClick={handleGenerate}
//         className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 mb-6"
//         disabled={!department}
//       >
//         Generate Timetable
//       </button>
//       {timetable.length > 0 && <TimetableDisplay timetableData={timetable} />}
//     </div>
//   );
// }

// export default GeneratePage;