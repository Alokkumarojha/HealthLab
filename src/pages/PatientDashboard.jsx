import React, { useEffect, useState } from "react";
import { getAllPatients } from "../appwrite/database";
import authService from "../appwrite/auth";
import Spinner from "./Spinner";
import { FaFilePdf } from "react-icons/fa";

function PatientDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const result = await getAllPatients(currentUser.$id);

          // ✅ Sort by testDate (latest first)
          const sortedPatients = result.sort(
            (a, b) => new Date(b.testDate) - new Date(a.testDate)
          );

          setPatients(sortedPatients);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Patient Dashboard</h1>

      {patients.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Age</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Test Type</th>
              <th className="border px-4 py-2">Test Date</th>
              <th className="border px-4 py-2">Report Status</th>
              <th className="border px-4 py-2">View Report</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.$id} className="text-center">
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.age}</td>
                <td className="border px-4 py-2 capitalize">
                  {patient.gender}
                </td>
                <td className="border px-4 py-2">{patient.testType}</td>
                <td className="border px-4 py-2">
                  {new Date(patient.testDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      patient.reportStatus === "pending"
                        ? "bg-yellow-500"
                        : patient.reportStatus === "completed"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {patient.reportStatus}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  {patient.reportUrl ? (
                    <a
                      href={patient.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      title="View and Download PDF Report"
                      className="flex items-center justify-center text-blue-600 hover:underline gap-1"
                    >
                      <FaFilePdf className="text-red-600" />
                      View Report
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // ✅ Empty state UI
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg">No patients found yet.</p>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
