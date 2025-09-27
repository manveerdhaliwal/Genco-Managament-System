// const DutyLeavesSection = () => {
//   const leaves = [
//     { event: "Sports Event", date: "March 15–16, 2024", status: "Approved" },
//     { event: "College Festival", date: "April 24–25, 2024", status: "Pending" },
//     { event: "Seminar", date: "May 5, 2024", status: "Rejected" },
//   ];

//   return (
//     <div className="bg-white p-4 rounded-xl shadow">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="font-bold text-lg">Duty Leaves</h2>
//         <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//           Apply for Duty Leave
//         </button>
//       </div>
//       <table className="w-full text-sm">
//         <thead>
//           <tr className="text-left text-gray-500">
//             <th className="py-2">Event</th>
//             <th>Dates</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaves.map((leave, i) => (
//             <tr key={i} className="border-t">
//               <td className="py-2">{leave.event}</td>
//               <td>{leave.date}</td>
//               <td>
//                 <span
//                   className={`px-2 py-1 rounded text-xs ${
//                     leave.status === "Approved"
//                       ? "bg-green-100 text-green-700"
//                       : leave.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {leave.status}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DutyLeavesSection;

// components/student/DutyLeaves.tsx
export default function DutyLeaves() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Duty Leaves</h2>
      <p>Here you can manage your duty leaves...</p>
    </div>
  );
}
