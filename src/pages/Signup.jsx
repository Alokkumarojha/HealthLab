import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { login as loginAction } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Create account
      const user = await authService.createAccount({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (user) {
        // Step 2: Login after signup
        await authService.login({
          email: formData.email,
          password: formData.password,
        });

        // ✅ Step 3: Update preferences with role
        const updatedPrefs = await authService.updatePrefs({
          role: formData.role,
        });
        console.log("Updated preferences after setting role:", updatedPrefs);
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const userRole = currentUser?.prefs?.role || "patient";
          console.log("User Role after signup:", userRole);

          dispatch(loginAction({ userData: currentUser, role: userRole }));

          // Step 5: Navigate by role
          if (userRole === "lab") {
            navigate("/lab-dashboard");
          } else {
            navigate("/patient-dashboard");
          }
        } else {
          setError("Unable to fetch user after login");
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong during signup");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

      {error && (
        <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="patient">Patient</option>
            <option value="lab">Lab</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
