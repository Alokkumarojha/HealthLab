import { databases, ID ,storage } from "./config";
import conf from "../conf/conf";
import { Query } from "appwrite";

// Get all patients
export const getAllPatients = async (userId) => {
  try {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [Query.equal("userId", userId)]
    );
    console.log("Response from database:", response);
    console.log("Fetched patients from database:", response.documents);
    return response.documents;
  } catch (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
};

// 🧪 Admin / LabDashboard ke liye – Sabhi patients
export const getAllPatientsForAdmin = async () => {
  try {
    const response = await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching all patients:", error);
    return [];
  }
};

// Add a new patient
export const addPatient = async (data) => {
  try {
    const response = await databases.createDocument(
     
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error adding patient:", error);
    throw error;
  }
};

// Add a new user with role
export const addUserWithRole = async ({ userId, name, email, role }) => {
  return await databases.createDocument(
    conf.appwriteDatabaseId,
    conf.appwriteUserCollectionId,
    ID.unique(),
    {
      userId,
      name,
      email,
      role,
    }
  );
};

// ✅ Delete a patient
export const deletePatient = async (patientId) => {
  try {
    const response = await databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      patientId
    );
    return response;
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
};

// ✅ Update a patient
export const updatePatient = async (patientId, updatedData) => {
  try {
    const response = await databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      patientId,
      updatedData
    );
    return response;
  } catch (error) {
    console.error("Error updating patient:", error);
    throw error;
  }
};

export const uploadReport = async (file) => {
  try {
    const uploadedFile = await storage.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file
    );

    const fileUrl = storage.getFileView(conf.appwriteBucketId, uploadedFile.$id); // ✅ No await here

    return { href: fileUrl }; // ✅ Wrap in object if needed
  } catch (err) {
    console.error("Failed to upload report:", err);
    throw err;
  }
};



