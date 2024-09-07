import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import CONSTANTS, { TOAST } from "../../Constants/common";
import store from "../../Redux/Store/reduxStore";
import { setCredentials, logout } from "../../Redux/UserAuthSlice/authSlice";
import { toast } from "react-toastify";
import { logoutUser, refreshAccessToken } from "../Auth/auth";

const axiosUserInstance = axios.create({
  baseURL: CONSTANTS.API_BASE_URL,
  withCredentials: true,
});

export const axiosRefreshInstance = axios.create({
  baseURL: CONSTANTS.API_BASE_URL,
  withCredentials: true,
});

axiosUserInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { accessToken } = store.getState().userAuth;
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosUserInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (error.response.data.message === "User is blocked") {
          await logoutUser();
          toast.dismiss();
          toast.error("Your account has been blocked. Please contact admin.", TOAST);
          setTimeout(() => {
            store.dispatch(logout());
          }, 2000);
          return;
        }
        const { accessToken } = await refreshAccessToken();
        console.log("Access token: ", accessToken);
        const { user } = store.getState().userAuth;     
        console.log("User data: ", user)
        store.dispatch(setCredentials({ accessToken, user }));
        originalRequest.headers.authorization = `Bearer ${accessToken}`;
        return axiosUserInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosUserInstance;
