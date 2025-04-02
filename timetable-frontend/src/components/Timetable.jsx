import React from "react";

function Timetable({ timetableData }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = [
    "9:35-10:20",
    "10:20-11:10",
    "11:10-12:00",
    "12:00-12:50",
    "1:35-2:20",
    "2:20-3:05",
    "3:05-3:50",
    "3:50-4:35",
  ];

  const getSlotData = (day, slot) => {
    const entry = timetableData.find(
      (item) => item.Day === day && item.Slot === slot
    );
    if (!entry || entry.Subject === "FREE") return "FREE";
    return `${entry.Subject} (${entry.Faculty}) [${entry.Room}]`;
  };

  return (
    <div className="overflow-x-auto animate-slide-up">
      <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 text-left">Day / Slot</th>
            {slots.map((slot) => (
              <th key={slot} className="p-3 text-center">
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr
              key={day}
              className="border-b hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-3 font-semibold text-gray-700">{day}</td>
              {slots.map((slot) => (
                <td key={slot} className="p-3 text-center text-gray-600">
                  {getSlotData(day, slot)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;