// import { useEffect, useState } from "react";
// import {
//   getAllPatientsForAdmin,
//   deletePatient,
//   updatePatient,
//   uploadReport,
// } from "../appwrite/database";
// import Spinner from "./Spinner";
// import { FaFilePdf } from "react-icons/fa";

// const LabDashboard = () => {
//   const [patients, setPatients] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [editingPatient, setEditingPatient] = useState(null);
//   const [updatedName, setUpdatedName] = useState("");
//   const [updatedAge, setUpdatedAge] = useState("");
//   const [updatedGender, setUpdatedGender] = useState("");
//   const [updatedTestType, setUpdatedTestType] = useState("");
//   const [updatedStatus, setUpdatedStatus] = useState("");
//   const [updatedReport, setUpdatedReport] = useState(null);

//   useEffect(() => {
//     getAllPatientsForAdmin()
//       .then((data) => {
//         const sorted = data.sort(
//           (a, b) => new Date(b.testDate) - new Date(a.testDate)
//         );
//         setPatients(sorted);
//         setFilteredPatients(sorted);
//       })
//       .catch((err) => console.error("Error loading patients:", err))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);
//     const filtered = patients.filter(
//       (p) =>
//         p.name.toLowerCase().includes(value) ||
//         p.testType.toLowerCase().includes(value)
//     );
//     setFilteredPatients(filtered);
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this patient?")) {
//       await deletePatient(id);
//       const updatedList = patients.filter((p) => p.$id !== id);
//       setPatients(updatedList);
//       setFilteredPatients(updatedList);
//     }
//   };

//   const handleEditClick = (patient) => {
//     console.log("Rendering patient:", patient);

//     setEditingPatient(patient);
//     setUpdatedName(patient.name);
//     setUpdatedAge(patient.age);
//     setUpdatedGender(patient.gender);
//     setUpdatedTestType(patient.testType);
//     setUpdatedStatus(patient.reportStatus);
//   };

//   const determineFinalStatus = (currentStatus, reportFile, previousStatus) => {
//     const isDefaultPending =
//       currentStatus === "Pending" && currentStatus === previousStatus;
//     if (reportFile && isDefaultPending) {
//       return "Completed";
//     }
//     return currentStatus || previousStatus;
//   };

//   const handleUpdate = async () => {
//     let updatedReportUrl = null;

//     // Upload the new report if selected
//     if (updatedReport) {
//       try {
//         const fileUrl = await uploadReport(updatedReport);
//         console.log("Uploaded report URL from uploadReport():", fileUrl);
//         updatedReportUrl = fileUrl.href;
//         console.log("updatedReportUrl:", updatedReportUrl);
//       } catch (uploadError) {
//         console.error("Error uploading report:", uploadError);
//       }
//     }

//     const finalStatus = determineFinalStatus(
//       updatedStatus,
//       updatedReport,
//       editingPatient.reportStatus
//     );

//     const updatedData = {
//       name: updatedName,
//       age: parseInt(updatedAge),
//       gender: updatedGender,
//       testType: updatedTestType,
//       reportStatus: finalStatus,
//       ...(updatedReportUrl && { reportUrl: updatedReportUrl }),
//     };

//     console.log("Updated data going to Appwrite:", updatedData);
//     console.log("updatedStatus:", updatedStatus);
//     console.log("updatedReport:", updatedReport);
//     console.log("previousStatus:", editingPatient.reportStatus);
//     console.log("finalStatus:", finalStatus);

//     try {
//       await updatePatient(editingPatient.$id, updatedData);
//       console.log("Updated data going to Appwrite:", updatedData);

//       const updated = patients.map((p) =>
//         p.$id === editingPatient.$id ? { ...p, ...updatedData } : p
//       );
//       const refreshed = [...updated]; // force state update with new reference
//       setPatients(refreshed);
//       setFilteredPatients(refreshed);

//       setPatients(updated);
//       setFilteredPatients(updated);
//       setEditingPatient(null);

//       // Clear fields
//       setUpdatedName("");
//       setUpdatedAge("");
//       setUpdatedGender("");
//       setUpdatedTestType("");
//       setUpdatedStatus("");
//       setUpdatedReport(null); // ✅ clear report too
//     } catch (error) {
//       console.error("Failed to update patient:", error);
//       alert("Something went wrong while updating patient.");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">
//         Lab Dashboard
//       </h1>

//       <input
//         type="text"
//         placeholder="Search by name or test type..."
//         className="mb-6 px-4 py-2 border rounded w-full shadow-sm"
//         value={searchTerm}
//         onChange={handleSearch}
//       />

//       {loading ? (
//         <Spinner />
//       ) : filteredPatients.length === 0 ? (
//         <p className="text-center text-gray-600 mt-10">
//           No patient data found.
//         </p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-blue-600 text-white">
//               <tr>
//                 <th className="py-3 px-4">Name</th>
//                 <th className="py-3 px-4">Age</th>
//                 <th className="py-3 px-4">Gender</th>
//                 <th className="py-3 px-4">Test Type</th>
//                 <th className="py-3 px-4">Test Date</th>
//                 <th className="py-3 px-4">Status</th>
//                 <th className="py-3 px-4">Report</th>
//                 {/* <th className="py-3 px-4">User ID</th> */}
//                 <th className="py-3 px-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredPatients.map((patient) => (
//                 <tr key={patient.$id} className="border-b hover:bg-gray-50">
//                   <td className="py-2 px-4">{patient.name}</td>
//                   <td className="py-2 px-4">{patient.age}</td>
//                   <td className="py-2 px-4 capitalize">{patient.gender}</td>
//                   <td className="py-2 px-4">{patient.testType}</td>
//                   <td className="py-2 px-4">
//                     {new Date(patient.testDate).toLocaleDateString()}
//                   </td>
//                   <td className="py-2 px-4">
//                     <span
//                       className={`px-2 py-1 rounded text-white text-xs font-medium ${
//                         patient.reportStatus?.toLowerCase() === "pending"
//                           ? "bg-yellow-500"
//                           : patient.reportStatus?.toLowerCase() === "completed"
//                           ? "bg-green-600"
//                           : "bg-red-500"
//                       }`}
//                     >
//                       {patient.reportStatus || "Unknown"}
//                     </span>
//                   </td>
//                   <td className="py-2 px-4">
//                     {patient.reportUrl ? (
//                       <a
//                         href={patient.reportUrl}
//                         download
//                         title="Download Report"
//                         className="flex items-center text-blue-600 hover:underline"
//                       >
//                         <FaFilePdf className="mr-1 text-red-600" /> View
//                       </a>
//                     ) : (
//                       <span className="text-gray-400 italic">
//                         Not Available
//                       </span>
//                     )}
//                   </td>
//                   {/* <td className="py-2 px-4 text-xs">{patient.userId}</td> */}
//                   <td className="py-2 px-4 space-x-2">
//                     <button
//                       onClick={() => handleEditClick(patient)}
//                       className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(patient.$id)}
//                       className="bg-red-500 text-white px-2 py-1 rounded text-xs"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* EDIT MODAL */}
//       {editingPatient && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
//             <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
//             <input
//               type="text"
//               value={updatedName}
//               onChange={(e) => setUpdatedName(e.target.value)}
//               className="w-full mb-3 px-4 py-2 border rounded"
//               placeholder="Patient Name"
//             />

//             <input
//               type="number"
//               value={updatedAge}
//               onChange={(e) => setUpdatedAge(e.target.value)}
//               className="w-full mb-3 px-4 py-2 border rounded"
//               placeholder="Age"
//             />

//             <input
//               type="file"
//               accept="application/pdf,image/*"
//               onChange={(e) => setUpdatedReport(e.target.files[0])}
//               className="w-full mb-3 px-4 py-2 border rounded"
//             />

//             <select
//               value={updatedGender}
//               onChange={(e) => setUpdatedGender(e.target.value)}
//               className="w-full mb-3 px-4 py-2 border rounded"
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>

//             <select
//               value={updatedTestType}
//               onChange={(e) => setUpdatedTestType(e.target.value)}
//               className="w-full mb-3 px-4 py-2 border rounded"
//             >
//               <option value="">Select Test Type</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//               <option value="Both">Both</option>
//             </select>

//             <select
//               value={updatedStatus}
//               onChange={(e) => setUpdatedStatus(e.target.value)}
//               className="w-full mb-4 px-4 py-2 border rounded"
//             >
//               <option value="Pending">Pending</option>
//               <option value="Completed">Completed</option>
//             </select>

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setEditingPatient(null)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdate}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LabDashboard;
