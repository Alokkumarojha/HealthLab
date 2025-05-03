import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Home() {
  const { status: authStatus, userData } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center bg-white shadow-md rounded p-6">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Welcome to Patient Records App
      </h1>

      {authStatus ? (
        <div>
          <p className="mb-4 text-lg text-gray-600">
            Hello,{" "}
            <span className="font-semibold">{userData?.name || "User"}</span> 👋
          </p>

          <Link
            to={
              userData?.prefs?.role === "lab"
                ? "/lab-dashboard"
                : "/patient-dashboard"
            }
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-all duration-200"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-200"
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
