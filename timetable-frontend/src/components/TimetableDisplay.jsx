import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion for animations

function TimetableDisplay({ timetableData }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["9:35-10:20", "10:20-11:10", "11:10-12:00", "12:00-12:50", "1:35-2:20", "2:20-3:05", "3:05-3:50", "3:50-4:35"];
  const branches = [...new Set(timetableData.map((item) => item.Branch))];

  const getSlotData = (day, slot, branch) => {
    const entry = timetableData.find((item) => item.Day === day && item.Slot === slot && item.Branch === branch);
    if (!entry || entry.Subject === "FREE") return "FREE";
    return `${entry.Subject} (${entry.Faculty}) [${entry.Room}]`;
  };

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      {branches.map((branch) => (
        <motion.div key={branch} variants={rowVariants}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{branch} Timetable</h2>
          <div className="overflow-x-auto">
            <motion.table
              className="min-w-full bg-white shadow-md rounded-lg border border-gray-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="p-3 text-left font-semibold">Day / Slot</th>
                  {slots.map((slot) => (
                    <th key={slot} className="p-3 text-center font-semibold">
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <motion.tr
                    key={day}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                    variants={rowVariants}
                  >
                    <td className="p-3 font-semibold text-gray-700">{day}</td>
                    {slots.map((slot) => (
                      <td
                        key={slot}
                        className="p-3 text-center text-gray-600 break-words max-w-xs"
                      >
                        {getSlotData(day, slot, branch)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default TimetableDisplay;

// import React from "react";

// function TimetableDisplay({ timetableData }) {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
//   const slots = ["9:35-10:20", "10:20-11:10", "11:10-12:00", "12:00-12:50", "1:35-2:20", "2:20-3:05", "3:05-3:50", "3:50-4:35"];
//   const branches = [...new Set(timetableData.map((item) => item.Branch))];

//   const getSlotData = (day, slot, branch) => {
//     const entry = timetableData.find((item) => item.Day === day && item.Slot === slot && item.Branch === branch);
//     if (!entry || entry.Subject === "FREE") return "FREE";
//     return `${entry.Subject} (${entry.Faculty}) [${entry.Room}]`;
//   };

//   return (
//     <div className="space-y-8 animate-slide-up">
//       {branches.map((branch) => (
//         <div key={branch}>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">{branch} Timetable</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
//               <thead>
//                 <tr className="bg-blue-600 text-white">
//                   <th className="p-3 text-left">Day / Slot</th>
//                   {slots.map((slot) => (
//                     <th key={slot} className="p-3 text-center">{slot}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {days.map((day) => (
//                   <tr key={day} className="border-b hover:bg-gray-50 transition-colors duration-200">
//                     <td className="p-3 font-semibold text-gray-700">{day}</td>
//                     {slots.map((slot) => (
//                       <td key={slot} className="p-3 text-center text-gray-600">{getSlotData(day, slot, branch)}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default TimetableDisplay;