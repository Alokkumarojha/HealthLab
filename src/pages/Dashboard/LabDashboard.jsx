// LabDashboard.jsx
import { useEffect, useState } from "react";
import {
  getAllPatientsForAdmin,
  deletePatient,
  updatePatient,
  uploadReport,
} from "../../appwrite/database";
import Spinner from "../Spinner";
import PatientTable from "./PatientTable";

const LabDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPatientsForAdmin()
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.testDate) - new Date(a.testDate)
        );
        setPatients(sorted);
        setFilteredPatients(sorted);
      })
      .catch((err) => console.error("Error loading patients:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        p.testType.toLowerCase().includes(value)
    );
    setFilteredPatients(filtered);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">
        Lab Dashboard
      </h1>

      <input
        type="text"
        placeholder="Search by name or test type..."
        className="mb-6 px-4 py-2 border rounded w-full shadow-sm"
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        <Spinner />
      ) : (
        <PatientTable
          patients={filteredPatients}
          setPatients={setPatients}
          allPatients={patients}
          setFilteredPatients={setFilteredPatients}
          deletePatient={deletePatient}
          updatePatient={updatePatient}
          uploadReport={uploadReport}
        />
      )}
    </div>
  );
};

export default LabDashboard;
