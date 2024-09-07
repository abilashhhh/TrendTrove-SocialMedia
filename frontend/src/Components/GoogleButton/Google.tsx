import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, provider } from "../../API/Firebase/FirebaseConfig";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { loginUsingGoogle } from "../../API/Auth/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../Redux/UserAuthSlice/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Google: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;

      if (displayName && email && photoURL) {
        console.log(
          "Data from google component: ",
          displayName,
          email,
          photoURL
        );
        let response = await loginUsingGoogle({
          name: displayName,
          email,
          dp: photoURL,
        });
        console.log("ResponseData : googlecomponen: ", response);

        if (response.status === "success") {
          dispatch(
            setCredentials({
              user: response.user,
              accessToken: response.accessToken,
            })
          );
          // console.log("response.user : ", response.user);
          console.log("response.accessToken : ", response.accessToken);
          toast.success("Sign in successful");
          toast.success("Navigating to homepage...");
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } else {
          toast.error("Failed to sign in");
        }
      } else {
        console.error("Missing user information from Google sign-in.");
        toast.error("Failed to sign in");
      }
    } catch (error:any) {
      console.error("Error during Google sign-in:", error);
      toast.error(`Failed  ${error.response.data.message}`);
    }
  };

  return (
    <>
      <ToastContainer />

      <button
        onClick={handleClick}
        type="button"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-800 focus:outline-none">
        <div className="flex items-center">
          <FaGoogle className="mr-2" />
          <span>Continue with Google</span>
        </div>
      </button>
    </>
  );
};

export default Google;
