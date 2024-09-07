import React, { useState, useEffect, useCallback } from "react";
import TrendTroveLogo from "../Components/Logo/TrendTroveLogo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  forgotPasswordChangePass,
  verifyMailForForgotPass,
  verifyOtp,
} from "../API/Auth/auth";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validations";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordData {
  otp: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    formData: { email: "", otp: "", password: "", confirmPassword: "" },
    otpSent: false,
    otpVerified: false,
    emailData: true,
    errors: { email: "", password: "", confirmPassword: "" },
  });

  const setFormData = useCallback((data: Partial<ForgotPasswordData>) => {
    setState(prevState => ({
      ...prevState,
      formData: { ...prevState.formData, ...data },
    }));
  }, []);

  const setErrors = useCallback((data: Partial<typeof state.errors>) => {
    setState(prevState => ({
      ...prevState,
      errors: { ...prevState.errors, ...data },
    }));
  }, []);

  const setStatus = useCallback(
    (data: Partial<Omit<typeof state, "formData" | "errors">>) => {
      setState(prevState => ({ ...prevState, ...data }));
    },
    []
  );

  useEffect(() => {
    const savedState = localStorage.getItem("forgotPasswordState");
    if (savedState) {
      setState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("forgotPasswordState", JSON.stringify(state));
  }, [state]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData({ [id]: value });

      if (id === "password") {
        setErrors({ password: validatePassword(value) });
      } else if (id === "confirmPassword") {
        const confirmPasswordError =
          value !== state.formData.password ? "Passwords do not match" : "";
        setErrors({
          confirmPassword:
            confirmPasswordError || validateConfirmPassword(value),
        });
      }
    },
    [setFormData, setErrors, state.formData.password]
  );

  const generateOtp = async () => {
    const emailError = validateEmail(state.formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    const result = await verifyMailForForgotPass(
      state.formData.email,
      "forgot-password"
    );
    if (result.status === "success") {
      toast.success(result.message);
      setStatus({ otpSent: true });
    } else {
      toast.error(result.message);
    }
  };

  const verifyOtpHandler = async () => {
    const result = await verifyOtp(state.formData.email, state.formData.otp);
    if (result.status === "success") {
      toast.success("OTP verified successfully!");
      setStatus({ otpVerified: true, otpSent: false, emailData: false });
    } else {
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  const verifyPasswordHandler = async () => {
    const passwordError = validatePassword(state.formData.password);
    const confirmPasswordError =
      state.formData.password !== state.formData.confirmPassword
        ? "Passwords do not match"
        : "";

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    const result = await forgotPasswordChangePass(
      state.formData.email,
      state.formData.password
    );
    if (result.status === "success") {
      toast.success("Password changed successfully!");
      localStorage.removeItem("forgotPasswordState");
      setState({
        formData: { email: "", otp: "", password: "", confirmPassword: "" },
        otpSent: false,
        otpVerified: false,
        emailData: true,
        errors: { email: "", password: "", confirmPassword: "" },
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      toast.error("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-100">
      <TrendTroveLogo />
      <ToastContainer />
      <div className="w-full max-w-4xl mx-auto mt-10 p-10 border rounded-lg bg-white">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {state.emailData && (
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700">
              Enter your email address:
            </label>
            <div className="flex justify-center items-center mt-1">
              <div className="w-full">
                <input
                  type="email"
                  onChange={handleChange}
                  id="email"
                  name="email"
                  required
                  value={state.formData.email}
                  className="focus:ring-gray-500 p-4 border text-black bg-slate-50 border-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-lg rounded-md"
                />
                {state.errors.email && (
                  <p className="text-red-500 text-sm">{state.errors.email}</p>
                )}
              </div>
              <div className="ml-2">
                <button
                  type="button"
                  onClick={generateOtp}
                  className="bg-green-700 text-white p-4 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {state.otpSent && (
          <>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700">
                Enter the OTP
              </label>
              <div className="flex justify-center items-center mt-1">
                <div className="w-full">
                  <input
                    type="text"
                    onChange={handleChange}
                    id="otp"
                    name="otp"
                    required
                    value={state.formData.otp}
                    className="focus:ring-gray-500 p-4  text-black bg-slate-50 border border-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-lg rounded-md"
                  />
                </div>
                <div className="ml-2">
                  <button
                    type="button"
                    onClick={verifyOtpHandler}
                    className="bg-blue-700 text-white p-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {state.otpVerified && (
          <>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Create new password:
              </label>
              <input
                type="password"
                onChange={handleChange}
                id="password"
                name="password"
                required
                value={state.formData.password}
                className="focus:ring-gray-500 p-4 border  text-black bg-slate-50 border-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-lg rounded-md"
              />
              {state.errors.password && (
                <p className="text-red-500 text-sm">{state.errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700">
                Confirm new password:
              </label>
              <input
                type="password"
                onChange={handleChange}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={state.formData.confirmPassword}
                className="focus:ring-gray-500 p-4 border border-gray-500  text-black bg-slate-50 focus:border-gray-500 block w-full shadow-sm sm:text-lg rounded-md"
              />
              {state.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="flex justify-center items-center mt-1">
              <button
                type="button"
                onClick={verifyPasswordHandler}
                className="bg-violet-700 text-white p-4 rounded-md hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
                Change Password
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
