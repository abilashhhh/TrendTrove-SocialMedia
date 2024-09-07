import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import TrendTroveLogo from "../Components/Logo/TrendTroveLogo";
import Google from "../Components/GoogleButton/Google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  generateOtp,
  usernameAvailability,
  emailAvailability,
} from "../API/Auth/auth";

import { SignUpUserInterface } from "../Types/signUpUser";
import {
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhoneNumber,
  validateUsername,
} from "../utils/validations";
import debounce from "../utils/debouncer";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpUserInterface>({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value,
    }));

    if (id === "confirmPassword") {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword:
          value === formData.password ? "" : "Passwords do not match",
      }));
    } else {
      validateField(id, value);
    }
  };

  const validateField = (id: string, value: string) => {
    let validationMessage = "";

    switch (id) {
      case "name":
        validationMessage = validateName(value);
        break;
      case "username":
        validationMessage = validateUsername(value);
        break;
      case "email":
        validationMessage = validateEmail(value);
        break;
      case "phone":
        validationMessage = validatePhoneNumber(value);
        break;
      case "password":
        validationMessage = validatePassword(value);
        break;
      case "confirmPassword":
        validationMessage = validateConfirmPassword(value);
        break;
      default:
        break;
    }

    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [id]: validationMessage,
    }));
  };

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      try {
        const response = await usernameAvailability(username);
        setUsernameAvailable(response.available);
      } catch (error) {
        console.error("Error checking username availability:", error);
      }
    }, 500),
    []
  );

  const checkEmailAvailability = useCallback(
    debounce(async (email: string) => {
      try {
        const response = await emailAvailability(email);
        setEmailAvailable(response.available);
      } catch (error) {
        console.error("Error checking email availability:", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.username && formData.username.trim() !== "") {
      checkUsernameAvailability(formData.username);
    }
  }, [formData.username, checkUsernameAvailability]);

  useEffect(() => {
    if (formData.email && formData.email.trim() !== "") {
      checkEmailAvailability(formData.email);
    }
  }, [formData.email, checkEmailAvailability]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate fields
    for (const field in formData) {
      const value = formData[field as keyof SignUpUserInterface];
      if (typeof value === "string") {
        validateField(field, value);
      }
    }

    // Checking validation errors or password mismatch
    const hasErrors =
      Object.values(validationErrors).some(error => error !== "") ||
      formData.password !== formData.confirmPassword;

    if (
      !hasErrors &&
      (formData.name &&
        formData.username &&
        formData.email &&
        formData.password &&
        formData.confirmPassword) !== ""
    ) {
      try {
        // Check if email is available
        if (emailAvailable === false) {
          toast.error(
            "Email address is already registered. Please try logging in."
          );
          return;
        }

        // Check if username is available
        if (usernameAvailable === false) {
          toast.error(
            "Username is not available. Please choose a different one."
          );
          return;
        }

        // Removing confirmPassword data
        const { confirmPassword, ...userData } = formData;
        localStorage.setItem("signupData", JSON.stringify(formData));
        await generateOtp(userData.email, "email-verification");
        toast.success("OTP sent successfully");
        setTimeout(() => {
          navigate("/otp");
        }, 3000);
      } catch (error: any) {
        console.error(
          "Error signing up user:",
          error.response?.data?.message || error.message
        );
        toast.error(
          `Signup failed: ${error.response?.data?.message || error.message}`
        );
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-black">
      <TrendTroveLogo />
      <ToastContainer />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h5 className="mt-6 sm:text-l text-xl font-extrabold text-gray-900">
              Sign up to your account
            </h5>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-400 hover:text-blue-600">
                Log in to your account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700">
                Name
                <span className="text-red-700 text-bold font-large"> *</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                required
                className="mt-1 bg-white focus:ring-blue-500 p-3 border border-gray-300 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700">
                Username
                <span className="text-red-700 text-bold font-large"> *</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                required
                className="mt-1 bg-white focus:ring-blue-500 p-3 border border-gray-300 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
              />
              {validationErrors.username && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {validationErrors.username}
                </p>
              )}
              {usernameAvailable === false && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  Username not available
                </p>
              )}
              {!validationErrors.username && usernameAvailable === true && (
                <p className="text-green-500 text-xs font-semibold mt-1">
                  Username available
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Email address
                <span className="text-red-700 text-bold font-large"> *</span>
              </label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                name="email"
                required
                className="mt-1 bg-white focus:ring-blue-500 p-3 border border-gray-300 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {validationErrors.email}
                </p>
              )}
              {emailAvailable === false && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  Email id already registered, Try logging in
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                onChange={handleChange}
                name="phone"
                required
                className="mt-1 bg-white focus:ring-blue-500 p-3 border border-gray-300 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Password
                <span className="text-red-700 text-bold font-large"> *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={handleChange}
                  name="password"
                  required
                  className="mt-1 bg-white focus:ring-blue-500 p-3 border border-gray-300 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700">
                Confirm Password
                <span className="text-red-700 text-bold font-large"> *</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  required
                  className="mt-1 bg-white focus:ring-blue-500 p-3 border border-gray-300 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-800 focus:outline-none">
                Sign up
              </button>
            </div>

            <Google />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
