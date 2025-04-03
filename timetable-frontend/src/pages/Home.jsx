import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion for animations

function Home() {
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
    <div className="container mx-auto py-16 px-4 text-center bg-gradient-to-b from-gray-100 to-white min-h-screen">
      {/* Header with animation */}
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Automatic Timetable Generator
      </motion.h1>

      {/* Tagline with animation */}
      <motion.p
        className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Effortlessly create optimized timetables for your department using machine learning and a user-friendly interface.
      </motion.p>

      {/* Project Details Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Feature 1 */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Key Features</h3>
          <ul className="text-left text-gray-600 space-y-2">
            <li>Input faculty, subjects, rooms, and assignments via a simple interface.</li>
            <li>Generate conflict-free schedules with ML-driven optimization.</li>
            <li>Support for theory and lab slots with customizable constraints.</li>
          </ul>
        </motion.div>

        {/* Feature 2 */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Technology Stack</h3>
          <p className="text-gray-600">
            Built with Python, Django (OOP framework), scikit-learn (Random Forest), Pandas, NumPy, and RESTful APIs. Version control with GitHub.
          </p>
        </motion.div>

        {/* Feature 3 */}
        <motion.div
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
          variants={itemVariants}
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">Impact</h3>
          <p className="text-gray-600">
            Reduces manual scheduling effort by up to 80%, ensuring efficient timetables for departments like CSE, AIML, and AIDS.
          </p>
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="mt-12"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300 animate-pulse">
          Try Now
        </button>
      </motion.div>
    </div>
  );
}

export default Home;