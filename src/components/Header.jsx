import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import authService from "../appwrite/auth";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log("authStatus:", authStatus);
  console.log("userData:", userData);
  console.log("role:", role);

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate("/login");
    });
  };

  return (
    <header className="bg-gray-700 text-white p-4 shadow-md">
      <nav className="flex justify-between items-center container mx-auto">
        <Link to="/" className="text-xl font-bold">
          🩺 HealthLab
        </Link>

        <ul className="flex gap-4">
          <li>
            <Link to="/" className="hover:underline transition duration-300">
              Home
            </Link>
          </li>

          {authStatus && role ? (
            <>
              {role === "lab" && (
                <li>
                  <Link to="/add-patient" className="hover:underline">
                    Add Patient
                  </Link>
                </li>
              )}

              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:underline">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
