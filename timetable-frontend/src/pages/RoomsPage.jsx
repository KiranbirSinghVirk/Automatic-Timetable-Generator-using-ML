import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import AddRooms from "../components/AddRooms";

function RoomsPage() {
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
    <div className="container mx-auto py-16 px-4 bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Header with animation */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Add Rooms
      </motion.h1>

      {/* Introduction with animation */}
      <motion.p
        className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto text-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Add rooms to your timetable system, specifying their branch and type (classroom or lab) for accurate scheduling.
      </motion.p>

      {/* AddRooms Component */}
      <motion.div
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AddRooms />
      </motion.div>
    </div>
  );
}

export default RoomsPage;

// import React from "react";
// import AddRooms from "../components/AddRooms";

// function RoomsPage() {
//   return (
//     <div className="container mx-auto py-12 px-4">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Add Rooms</h1>
//       <AddRooms />
//     </div>
//   );
// }

// export default RoomsPage;