import React, { useState, useEffect } from "react";
import { updatePatient } from "../appwrite/database"; // You must create this method
import { useSelector } from "react-redux";

function EditPatientModal({ isOpen, onClose, patientData, onUpdated }) {
  const [formData, setFormData] = useState({ ...patientData });

  useEffect(() => {
    setFormData(patientData); // Update form when modal is opened with new data
  }, [patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value, 10) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(patientData.$id, formData);
      onUpdated(); // Optionally refresh list in parent
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Name"
          />
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Age"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder=""
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="testType"
            value={formData.testType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Test Type</option>
            <option value="BloodTest">Blood Test</option>
            <option value="Ultrasound">Ultrasound</option>
            <option value="Both">Both</option>
          </select>

          <input
            type="datetime-local"
            name="testDate"
            value={formData.testDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <select
            name="reportStatus"
            value={formData.reportStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button type="button" onClick={onClose} className="text-red-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;
