// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { getAllPatients } from "../appwrite/database";
// import { setPatients } from "../store/patientSlice";

// const PatientDetails = () => {
//   const dispatch = useDispatch();
//   const userData = useSelector((state) => state.auth.userData);
//   const patients = useSelector((state) => state.patient.patients);

//   const userId = userData?.$id;

//   useEffect(() => {
//     if (userId) {
//       console.log("User ID for fetching patients:", userId);
//       getAllPatients(userId)
//         .then((fetchedPatients) => {
//           console.log("Fetched Patients:", fetchedPatients);
//           dispatch(setPatients(fetchedPatients));
//         })
//         .catch((error) => {
//           console.error("Error fetching patients:", error);
//         });
//     }
//   }, [userId, dispatch]);

//   return (
//     <div>
//       {/* Patient List */}
//       {patients.length > 0 ? (
//         patients.map((patient) => (
//           <div key={patient.$id}>
//             <h3>{patient.name}</h3>
//           </div>
//         ))
//       ) : (
//         <p>No patients found.</p>
//       )}
//       {/* Pass patients to LabDashboard */}
//       <LabDashboard patients={patients} />
//     </div>
//   );
// };

// export default PatientDetails;
