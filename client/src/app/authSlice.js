import { createSlice } from "@reduxjs/toolkit";
import axios from "../api/axios";

const initialState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.status = "loading";
    },
    loginSuccess: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.status = "loading";
    },
    registerSuccess: (state) => {
      state.status = "succeeded";
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    resetPasswordRequest: (state) => {
      state.status = "loading";
    },
    resetPasswordSuccess: (state) => {
      state.status = "succeeded";
      state.error = null;
    },
    resetPasswordFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    forgetPasswordRequest: (state) => {
      state.status = "loading";
    },
    forgetPasswordSuccess: (state) => {
      state.status = "succeeded";
      state.error = null;
    },
    forgetPasswordFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  forgetPasswordRequest,
  forgetPasswordSuccess,
  forgetPasswordFailure,
  logout,
} = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post("/api/auth/login", credentials);
    dispatch(loginSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed.";
    dispatch(loginFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    await axios.post("/api/auth/register", userData);
    dispatch(registerSuccess());
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Registration failed.";
    dispatch(registerFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get("/api/auth/logout");
    dispatch(logout());
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const forgetPassword = (email) => async (dispatch) => {
  dispatch(forgetPasswordRequest());
  try {
    await axios.post("/api/auth/forget-password", { email });
    dispatch(forgetPasswordSuccess());
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to send reset link.";
    dispatch(forgetPasswordFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const resetPassword = (email, password, token) => async (dispatch) => {
  dispatch(resetPasswordRequest());
  try {
    await axios.post(`/api/auth/reset-password/${token}`, {
      email,
      password,
    });
    dispatch(resetPasswordSuccess());
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to reset password.";
    dispatch(resetPasswordFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export default authSlice.reducer;
