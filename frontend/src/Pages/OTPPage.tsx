import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TrendTroveLogo from "../Components/Logo/TrendTroveLogo";
import { generateOtp, signUpUser, verifyOtp } from "../API/Auth/auth";
import { SignUpUserInterface } from "../Types/signUpUser";
import { ToastContainer, toast } from "react-toastify";

const OTPPage: React.FC = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState({ otp: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp({ otp: e.target.value });
  };

  const [resendTime, setResendTime] = useState(0);
  const [countdown, setCountdown] = useState(120);
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (resendTime > 0) {
      const timer = setInterval(() => {
        setResendTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTime]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    if (resendCount < 2) {
      const email = JSON.parse(
        localStorage.getItem("signupData") || "{}"
      ).email;
      await generateOtp(email, "email-verification");
      setCountdown(120);
      setResendTime(60);
      setResendCount(prev => prev + 1);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (countdown === 0) {
      toast.error("OTP has expired. Please request a new OTP.");
      return;
    }

    const email = JSON.parse(localStorage.getItem("signupData") || "{}").email;
    const otpValue = otp.otp;
    try {
      const result = await verifyOtp(email, otpValue);
      console.log("result:", result);
      if (result.status === "success") {
        toast.success("Account created successfully!");
        toast.success("Redirecting to login page...");

        const userData = JSON.parse(localStorage.getItem("signupData") || "{}");

        console.log("userdata from localstrorage: ", userData);

        await signUpUser(userData as SignUpUserInterface);

        localStorage.removeItem("signupData");

        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else if (result.data && result.data.status === "failed") {
        toast.error("Incorrect OTP. Try Again");
      } else {
        toast.error("Failed to create account.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <TrendTroveLogo />
      <ToastContainer />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h5 className="mt-6 sm:text-l text-xl  font-extrabold text-gray-900">
              OTP VERIFICATION
            </h5>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account ?{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-400 hover:text-blue-600">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <h2>
              OTP sent to mail id:{" "}
              {JSON.parse(localStorage.getItem("signupData") || "{}").email}
            </h2>
            {resendTime === 0 && resendCount < 2 && (
              <button
                onClick={handleResendOTP}
                className="mt-2 text-blue-600 hover:underline focus:outline-none">
                Resend OTP
              </button>
            )}
            {resendCount >= 2 && (
              <p className="mt-2 text-red-500">Resend limit reached</p>
            )}
            {resendTime > 0 && (
              <p className="mt-2 text-gray-500">
                Resend OTP in {resendTime} seconds
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="mt-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700">
                Enter the OTP
              </label>
              <input
                type="number"
                id="otp"
                name="otp"
                required
                onChange={handleChange}
                className="mt-1 focus:ring-gray-500 p-3 border border-gray-500 focus:border-gray-500 block w-full shadow-sm sm:text-sm  rounded-md  bg-slate-100" 
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gray-600 hover:bg-gray-800 focus:outline-none">
                Verify OTP
              </button>
            </div>
          </form>
          {countdown > 0 && (
            <p className="text-gray-500 mt-4">
              OTP will expire in {Math.floor(countdown / 60)}:
              {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
