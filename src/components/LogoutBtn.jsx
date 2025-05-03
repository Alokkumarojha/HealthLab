import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import { logout as logoutAction } from "../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logoutAction());
      navigate("/login");
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
