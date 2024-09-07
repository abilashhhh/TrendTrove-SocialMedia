import END_POINTS from "../../Constants/endpoints";
import axios, { AxiosError } from "axios";
import {
  EmailAvailabilityResponse,
  SignUpUserInterface,
  SignupUserResponse,
  UsernameAvailabilityResponse,
  forgotPassword,
} from "../../Types/signUpUser";
import {
  GoogleLoginInterface,
  GoogleLoginResponse,
  LogoutResponse,
  SignInUserInterface,
  SignInUserResponse,
} from "../../Types/signInUser";
import axiosUserInstance, {
  axiosRefreshInstance,
} from "../Axios/axiosUserInstance";

// Utility function for handling Axios errors
const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        "Server responded with status:",
        axiosError.response.status
      );
      console.error("Response data:", axiosError.response.data);
    } else if (axiosError.request) {
      console.error("No response received from the server");
    } else {
      console.error("Error setting up the request:", axiosError.message);
    }
  } else {
    console.error("An error occurred:", error.message);
  }
};

// Sign up user
export const signUpUser = async (
  payload: SignUpUserInterface
): Promise<SignupUserResponse> => {
  try {
    const response = await axios.post<SignupUserResponse>(
      END_POINTS.SIGNUP_USER,
      payload
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const verifyMailForForgotPass = async (
  email: string,
  text: string
): Promise<forgotPassword> => {
  try {
  //  console.log("email, string :", email, text);
    const response = await axios.post<SignupUserResponse>(
      END_POINTS.FORGOT_PASSWORD,
      { email, text }
    );
  //  console.log("response.data; ", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const forgotPasswordChangePass = async (
  email: string,
  password: string
): Promise<forgotPassword> => {
  try {
  //  console.log("email, string :", email, password);
    const response = await axios.post<SignupUserResponse>(
      END_POINTS.FORGOT_PASSWORD_CHANGE,
      { email, password }
    );
  //  console.log("response.data; ", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Check username availability
export const usernameAvailability = async (
  username: string
): Promise<UsernameAvailabilityResponse> => {
  try {
    const response = await axios.get<UsernameAvailabilityResponse>(
      `${END_POINTS.USERNAME_AVAILABLE}/${username}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Check email availability
export const emailAvailability = async (
  email: string
): Promise<EmailAvailabilityResponse> => {
  try {
    const response = await axios.get<EmailAvailabilityResponse>(
      `${END_POINTS.EMAIL_AVAILABLE}/${email}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Generate OTP
export const generateOtp = async (
  email: string,
  text: string
): Promise<void> => {
  try {
    await axios.post(END_POINTS.GENERATE_OTP, { email, text });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Verify OTP
export const verifyOtp = async (email: string, otp: string): Promise<any> => {
  try {
    const result = await axios.post(END_POINTS.VERIFY_OTP, { email, otp });
    return result.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Sign in user
export const signin = async (
  payload: SignInUserInterface
): Promise<SignInUserResponse> => {
  try {
    const response = await axios.post<SignInUserResponse>(
      END_POINTS.LOGIN,
      payload
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Login using Google
export const loginUsingGoogle = async (
  payload: GoogleLoginInterface
): Promise<GoogleLoginResponse> => {
  try {
  //  console.log( "payload from loginUsingGoogle, data passed to backend ,",payload);
    const response = await axiosRefreshInstance.post<GoogleLoginResponse>(
      END_POINTS.GOOGLE_LOGIN_SIGNUP_USER,
      payload
    );
  //  console.log( "loginUsing Google api auth , response data from the backend ",response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const response = await axiosUserInstance.delete<LogoutResponse>(
      END_POINTS.LOGOUT_USER
    );
    return response.data;
  } catch (error) {
    console.error("Error occurred during logout:", error);
    throw error;
  }
};

interface RefreshTokenResponse {
  accessToken: string;
}


export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const response = await axiosRefreshInstance.get<RefreshTokenResponse>(
      END_POINTS.REFRESH_TOKEN,
      {
        withCredentials: true,
      }
    );
    console.log("Refresh access token : ,response.data : ", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
