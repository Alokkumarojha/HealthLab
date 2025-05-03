// PatientTable.jsx
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

const PatientTable = ({
  patients,
  setPatients,
  allPatients,
  setFilteredPatients,
  deletePatient,
  updatePatient,
  uploadReport,
}) => {
  const [editingPatient, setEditingPatient] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedAge, setUpdatedAge] = useState("");
  const [updatedGender, setUpdatedGender] = useState("");
  const [updatedTestType, setUpdatedTestType] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedReport, setUpdatedReport] = useState(null);
  console.log("patientsa", patients);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      await deletePatient(id);
      const updatedList = allPatients.filter((p) => p.$id !== id);
      setPatients(updatedList);
      setFilteredPatients(updatedList);
    }
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setUpdatedName(patient.name);
    setUpdatedAge(patient.age);
    setUpdatedGender(patient.gender);
    setUpdatedTestType(patient.testType);
    setUpdatedStatus(patient.reportStatus);
  };

  const determineFinalStatus = (currentStatus, reportFile, previousStatus) => {
    const isDefaultPending =
      currentStatus === "Pending" && currentStatus === previousStatus;
    if (reportFile && isDefaultPending) {
      return "Completed";
    }
    return currentStatus || previousStatus;
  };

  const handleUpdate = async () => {
    let updatedReportUrl = null;
    if (updatedReport) {
      try {
        const fileUrl = await uploadReport(updatedReport);
        updatedReportUrl = fileUrl.href;
      } catch (uploadError) {
        console.error("Error uploading report:", uploadError);
      }
    }

    const finalStatus = determineFinalStatus(
      updatedStatus,
      updatedReport,
      editingPatient.reportStatus
    );

    const updatedData = {
      name: updatedName,
      age: parseInt(updatedAge),
      gender: updatedGender,
      testType: updatedTestType,
      reportStatus: finalStatus,
      ...(updatedReportUrl && { reportUrl: updatedReportUrl }),
    };

    try {
      await updatePatient(editingPatient.$id, updatedData);

      const updated = allPatients.map((p) =>
        p.$id === editingPatient.$id ? { ...p, ...updatedData } : p
      );

      setPatients(updated);
      setFilteredPatients(updated);
      setEditingPatient(null);

      // Clear fields
      setUpdatedName("");
      setUpdatedAge("");
      setUpdatedGender("");
      setUpdatedTestType("");
      setUpdatedStatus("");
      setUpdatedReport(null);
    } catch (error) {
      console.error("Failed to update patient:", error);
      alert("Something went wrong while updating patient.");
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Age</th>
            <th className="py-3 px-4">Gender</th>
            <th className="py-3 px-4">Test Type</th>
            <th className="py-3 px-4">Test Date</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Report</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.$id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{patient.name}</td>
              <td className="py-2 px-4">{patient.age}</td>
              <td className="py-2 px-4 capitalize">{patient.gender}</td>
              <td className="py-2 px-4">{patient.testType}</td>
              <td className="py-2 px-4">
                {new Date(patient.testDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    patient.reportStatus === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {patient.reportStatus}
                </span>
              </td>
              <td className="py-2 px-4">
                {patient.reportUrl ? (
                  <a
                    href={patient.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    <FaFilePdf />
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEditClick(patient)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.$id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPatient && (
        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Edit Patient</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              className="border px-4 py-2 rounded"
              placeholder="Name"
            />
            <input
              type="number"
              value={updatedAge}
              onChange={(e) => setUpdatedAge(e.target.value)}
              className="border px-4 py-2 rounded"
              placeholder="Age"
            />
            <input
              type="text"
              value={updatedGender}
              onChange={(e) => setUpdatedGender(e.target.value)}
              className="border px-4 py-2 rounded"
              placeholder="Gender"
            />
            <input
              type="text"
              value={updatedTestType}
              onChange={(e) => setUpdatedTestType(e.target.value)}
              className="border px-4 py-2 rounded"
              placeholder="Test Type"
            />
            <input
              type="text"
              value={updatedStatus}
              onChange={(e) => setUpdatedStatus(e.target.value)}
              className="border px-4 py-2 rounded"
              placeholder="Status"
            />
            <input
              type="file"
              onChange={(e) => setUpdatedReport(e.target.files[0])}
              className="border px-4 py-2 rounded"
            />
          </div>
          <button
            onClick={handleUpdate}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientTable;
