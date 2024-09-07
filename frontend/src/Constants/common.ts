import { ToastOptions } from "react-toastify";

const CONSTANTS = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  ERROR_NOTFOUND:
    "https://res.cloudinary.com/dkxyfsxso/image/upload/v1702381003/socioverse%20stock/404_nvavnv.svg",
};

export default CONSTANTS;

export const TOAST: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};
