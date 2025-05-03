import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../appwrite/auth";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async () => {
  const user = await authService.getCurrentUser();
  return user;
});

const initialState = {
  status: false,
  userData: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.status = true;
        state.userData = action.payload;
        state.role = action.payload?.prefs?.role || "patient"; // ✅ prefs se role nikalo
      }
    });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
