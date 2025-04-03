import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion for animations

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  // Animation variants for navbar links
  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.1, color: "#E5E7EB" }, // Hover effect (gray-200)
  };

  // Animation for mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            to="/"
            className="text-white text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 hover:text-gray-200 transition-all duration-300"
          >
            Timetable Generator
          </Link>
        </motion.div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <motion.svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </motion.svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <motion.div
          className="hidden md:flex space-x-6"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={linkVariants} whileHover="hover">
            <Link to="/faculty" className="text-white text-lg font-medium transition-colors duration-300">
              Add Faculty
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover">
            <Link to="/subjects" className="text-white text-lg font-medium transition-colors duration-300">
              Add Subjects
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover">
            <Link to="/rooms" className="text-white text-lg font-medium transition-colors duration-300">
              Add Rooms
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover">
            <Link to="/assignments" className="text-white text-lg font-medium transition-colors duration-300">
              Faculty Assignment
            </Link>
          </motion.div>
          <motion.div variants={linkVariants} whileHover="hover">
            <Link to="/generate" className="text-white text-lg font-medium transition-colors duration-300">
              Generate
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden mt-4"
        variants={mobileMenuVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        <div className="flex flex-col space-y-4">
          <Link
            to="/faculty"
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Add Faculty
          </Link>
          <Link
            to="/subjects"
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Add Subjects
          </Link>
          <Link
            to="/rooms"
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Add Rooms
          </Link>
          <Link
            to="/assignments"
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Faculty Assignment
          </Link>
          <Link
            to="/generate"
            className="text-white text-lg font-medium hover:text-gray-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Generate
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar;

// import React from "react";
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-all duration-300">
//           Timetable Generator
//         </Link>
//         <div className="space-x-6">
//           <Link to="/faculty" className="text-white hover:text-gray-200 transition-colors duration-300">Add Faculty</Link>
//           <Link to="/subjects" className="text-white hover:text-gray-200 transition-colors duration-300">Add Subjects</Link>
//           <Link to="/rooms" className="text-white hover:text-gray-200 transition-colors duration-300">Add Rooms</Link>
//           <Link to="/assignments" className="text-white hover:text-gray-200 transition-colors duration-300">Faculty Assignment</Link>
//           <Link to="/generate" className="text-white hover:text-gray-200 transition-colors duration-300">Generate</Link>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;