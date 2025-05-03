import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { login as loginAction } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    try {
      const session = await authService.login(formData);
      if (session) {
        const user = await authService.getCurrentUser();
        console.log("User role after login:", user?.prefs?.role);
        if (user) {
          const userRole = user?.prefs?.role || "patient";
          dispatch(loginAction({ userData: user, role: userRole }));

          navigate(
            userRole === "lab" ? "/lab-dashboard" : "/patient-dashboard"
          );
        } else {
          setError("Unable to fetch user data after login");
        }
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && (
        <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
