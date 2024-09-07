import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import store from "../Redux/Store/reduxStore";
import { getUserInfo } from "../API/Profile/profile";
import { useDispatch } from "react-redux";
import { setCredentials } from "../Redux/UserAuthSlice/authSlice";

interface TokenCheckMiddlewareProps {
  children: React.JSX.Element;
}

const TokenCheckMiddleware = ({
  children,
}: TokenCheckMiddlewareProps): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const { accessToken } = store.getState().userAuth;
    if (accessToken) {
      navigate("/home");
    } else {
      const fetchUser = async () => {
        const { user } = await getUserInfo();
        console.log(
          "User from the fetch user in token checker middleware : ",
          user
        );
        dispatch(setCredentials({ user }));
        return user;
      };

      fetchUser().then(user => (user ? navigate("/home") : ""));
    }
  }, [dispatch, navigate]);

  return children;
};

export default TokenCheckMiddleware;
