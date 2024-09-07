import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import configurationKeys from "../../config";

export const authService = () => {
  const encryptPassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  };

  const comparePassword = (password: string, hashedPassword: string) => {
    return bcryptjs.compare(password, hashedPassword);
  };

  const generateAccessToken = (payload: { userId: string; role: string }) => {
    const accessToken = jwt.sign(payload, configurationKeys.JWT_ACCESS_CODE, {
      expiresIn: "59m",
    });
    return accessToken;
  };

  const generateRefreshToken = (payload: { userId: string; role: string }) => {
    const refreshToken = jwt.sign(payload, configurationKeys.JWT_REFRESH_CODE, {
      expiresIn: "7d",
    });
    return refreshToken;
  };

  const verifyAccessToken = (token: string) => {
    const payload: { userId: string; role: string } = jwt.verify(
      token,
      configurationKeys.JWT_ACCESS_CODE
    ) as { userId: string; role: string };
    console.log("verifyAccessToken: payload : ", payload);
    return payload;
  };

  const verifyRefreshToken = (token: string) => {
    const payload: { userId: string; role: string } = jwt.verify(
      token,
      configurationKeys.JWT_REFRESH_CODE
    ) as { userId: string; role: string };
    console.log("verifyRefreshToken: payload : ", payload);

    return payload;
  };

  return {
    encryptPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
  };
};

export type AuthService = typeof authService;
export type AuthServiceReturn = ReturnType<AuthService>;
