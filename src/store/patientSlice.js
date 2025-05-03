import { createSlice } from '@reduxjs/toolkit';

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],  // Initial empty state for patients
  },
  reducers: {
    setPatients: (state, action) => {
      state.patients = action.payload;  // Store the fetched patients data
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);  // Add a new patient
    },
    removePatient: (state, action) => {
      state.patients = state.patients.filter(patient => patient.$id !== action.payload);  // Remove patient by id
    },
  },
});

export const { setPatients, addPatient, removePatient } = patientSlice.actions;
export default patientSlice.reducer;
