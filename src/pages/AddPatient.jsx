import React, { useState } from "react";
import { addPatient, uploadReport } from "../appwrite/database";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AddPatient() {
  const userData = useSelector((state) => state.auth.userData);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    testType: "",
    testDate: "",
    reportStatus: "",
  });
  const [reportFile, setReportFile] = useState(null); // 📂 File input state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value, 10) || "" : value,
    }));
  };

  const handleFileChange = (e) => {
    setReportFile(e.target.files[0]); // 🎯 Set file to state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let reportUrl = "";

      if (reportFile) {
        // 🛠 Upload report to Appwrite
        reportUrl = await uploadReport(reportFile);
        console.log("Uploaded report URL:", reportUrl);
      }

      const dataWithUserId = {
        ...formData,
        age: parseInt(formData.age),
        userId: userData?.$id,
        reportUrl, // 📎 Add report URL to formData
      };

      await addPatient(dataWithUserId);
      navigate("/lab-dashboard");
    } catch (err) {
      console.error("Error adding patient:", err);
      setError("Failed to add patient.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Patient</h2>
      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            required
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>🧬 Test type:</label>
          <select
            name="testType"
            value={formData.testType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Test Type --</option>
            <option value="BloodTest">Blood Test</option>
            <option value="Ultrasound">Ultrasound</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div>
          <label>📅 Test date:</label>
          <input
            type="datetime-local"
            name="testDate"
            required
            value={formData.testDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label>Report Status:</label>
          <select
            name="reportStatus"
            value={formData.reportStatus}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Report Status --</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label>📁 Upload Report (PDF/Image):</label>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPatient;
