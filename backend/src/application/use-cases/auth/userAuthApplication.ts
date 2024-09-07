import ErrorInApplication from "../../../utils/ErrorInApplication";
const otpGenerator = require("otp-generator");
import { UserDBInterface } from "../../repositories/userDBRepository";
import { AuthServiceInterface } from "../../services/authenticationServiceInterface";
import {
  GoogleUserInterface,
  UserInterface,
} from "../../../types/userInterface";
import { OtpDbInterface } from "../../repositories/OTPDBRepository";
import { MailSenderServiceInterface } from "../../services/mailServiceInterface";

export const userRegister = async (
  user: UserInterface,
  dbUserRepository: ReturnType<UserDBInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const existingEmail = await dbUserRepository.getUserByEmail(user.email);
  if (existingEmail) {
    throw new ErrorInApplication("Email already exists", 401);
  }

  const existingUsername = await dbUserRepository.getUserByUsername(user.username);
  if (existingUsername) {
    throw new ErrorInApplication("Username already exists!", 401);
  }

  user.password = await authService.encryptPassword(user.password);

  user.dp = `https://api.dicebear.com/8.x/thumbs/svg?seed=${user.username}`;

  await dbUserRepository.addUser(user);
};


// Handle OTP Sending
export const handleSendOtp = async (
  email: string,
  text: string,
  dbOtpRepository: ReturnType<OtpDbInterface>,
  mailSenderService: ReturnType<MailSenderServiceInterface>
) => {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await dbOtpRepository.saveNewOtp({ email, otp });
    if (text === "email-verification") {
      await mailSenderService.sendVerificationEmail(email, Number(otp));
    } else if (text === "forgot-password") {
      await mailSenderService.sendForgotPasswordEmail(email, Number(otp));
    }
  } catch (error) {
    throw new ErrorInApplication("Error in handleSendOtp", 401);
  }
};

// Handle Forgot Password Change
export const handleForgotPasswordChange = async (
  userId: string,
  newPassword: string,
  authService: ReturnType<AuthServiceInterface>,
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  try {
    const encryptedNewPassword = await authService.encryptPassword(newPassword);
    const user = await dbUserRepository.updatePassword(
      userId,
      encryptedNewPassword
    );
    return user;
  } catch (err) {
    throw new ErrorInApplication("Failed to change password", 401);
  }
};

// Handle OTP Verification
export const handleOtpVerification = async (
  email: string,
  otp: string,
  dbOtpRepository: ReturnType<OtpDbInterface>
) => {
  try {
    const latestOtp = await dbOtpRepository.getLatestOtp(email);
    if (!latestOtp || latestOtp.otp !== otp) {
      return false;
    }
    return true; // OTP verification successful
  } catch (error) {
    throw new ErrorInApplication("Error in handleOtpVerification", 401);
  }
};

// Handle Resending OTP
export const handleResendOtp = async (
  email: string,
  text: string,
  dbOtpRepository: ReturnType<OtpDbInterface>,
  mailSenderService: ReturnType<MailSenderServiceInterface>
) => {
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await dbOtpRepository.saveNewOtp({ email, otp });
    if (text === "email-verification") {
      await mailSenderService.sendVerificationEmail(email, Number(otp));
    } else if (text === "forgot-password") {
      await mailSenderService.sendForgotPasswordEmail(email, Number(otp));
    }
  } catch (error) {
    throw new ErrorInApplication("Error in handleResendOtp", 401);
  }
};

// User Login
export const login = async (
  email: string,
  password: string,
  dbUserRepository: ReturnType<UserDBInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const user = await dbUserRepository.getUserByEmail(email);
  if (!user) {
    throw new ErrorInApplication("Invalid email or password!", 401);
  }
  if (user.isBlocked) {
    throw new ErrorInApplication("Your account has been blocked!", 401);
  }

  const isPasswordCorrect = await authService.comparePassword(
    password,
    user?.password?.toString() || ""
  );
  if (!isPasswordCorrect) {
    throw new ErrorInApplication("Invalid email or password!", 401);
  }

  const userDetails = {
    _id: user?._id.toString(),
    name: user?.name,
    username: user?.username,
    email: user?.email,
    phone: user?.phone,
    address: user?.address,
    password: user?.password,
    dp: user?.dp,
    coverPhoto: user?.coverPhoto,
    bio: user?.bio,
    gender: user?.gender,
    isBlocked: user?.isBlocked,
    isPrivate: user?.isPrivate,
    isVerifiedAccount: user?.isVerifiedAccount,
    isGoogleSignedIn: user?.isGoogleSignedIn,
    isPremium: user?.isPremium,
    isAdmin: user?.isAdmin,
    isSuspended: user?.isSuspended,
    posts: user?.posts,
    requestsForMe: user?.requestsForMe,
    requestedByMe: user?.requestedByMe,
    followers: user?.followers,
    following: user?.following,
    savedPosts: user?.savedPosts,
    taggedPosts: user?.taggedPosts,
    notifications: user?.notifications,
    blockedUsers: user?.blockedUsers,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
  };

  const role = user.isAdmin ? "admin" : "user";
  const refreshToken = authService.generateRefreshToken({
    userId: user._id.toString(),
    role,
  });
  const accessToken = authService.generateAccessToken({
    userId: user._id.toString(),
    role,
  });
  await dbUserRepository.addRefreshTokenAndExpiry(email, refreshToken);

  return { userDetails, refreshToken, accessToken };
};

// Access Token Refresh
export const accessTokenRefresh = async (
  cookies: { refreshToken: string },
  dbUserRepository: ReturnType<UserDBInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  if (!cookies?.refreshToken) {
    throw new ErrorInApplication("Invalid token 1", 401);
  }

  const refreshToken = cookies.refreshToken;
  const { userId, role } = authService.verifyRefreshToken(
    refreshToken.toString()
  );
  if (!userId || role !== "user") {
    throw new ErrorInApplication("Invalid token 2", 401);
  }

  const user = await dbUserRepository.getUserById(userId);

  // console.log("user: ", user);
  // console.log("user?.refreshToken: ", user?.refreshToken);
  // console.log("user?.refreshTokenExpiresAt: ", user?.refreshTokenExpiresAt);

  if (!user?.refreshToken || !user?.refreshTokenExpiresAt) {
    throw new ErrorInApplication("Invalid token 3", 401);
  }

  if (user) {
    const expiresAt = user.refreshTokenExpiresAt?.getTime();
    if (Date.now() > expiresAt) {
      throw new ErrorInApplication("Invalid token 4", 401);
    }
  }

  const newAccessToken = authService.generateAccessToken({
    userId,
    role: "user",
  });
  return newAccessToken;
};

// Token Verification
export const tokenVerification = async (
  token: string,
  authService: ReturnType<AuthServiceInterface>
) => {
  const decodedToken = authService.verifyAccessToken(token);
  if (!decodedToken) {
    throw new ErrorInApplication("Invalid token 5", 401);
  } else {
    return decodedToken;
  }
};

export const handleLogoutUser = async (
  userId: string,
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  await dbUserRepository.logoutUser(userId);
};

//GOOGLE
export const handleGoogleLoginOrSignup = async (
  user: { name: string; email: string; dp: string },
  dbUserRepository: ReturnType<UserDBInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  let userDetails;
  let refreshToken;
  let accessToken;

  const existingUser = await dbUserRepository.getUserByEmail(user.email);
  if (existingUser) {
    const result = await userLoginUsingGoogle(
      user,
      dbUserRepository,
      authService
    );
    userDetails = { ...result.userDetails, password: undefined };
    refreshToken = result.refreshToken;
    accessToken = result.accessToken;
  } else {
    const result = await userRegisterUsingGoogle(
      user,
      dbUserRepository,
      authService
    );
    userDetails = { ...result.userDetails, password: undefined };
    refreshToken = result.refreshToken;
    accessToken = result.accessToken;
  }

  return {
    userDetails,
    refreshToken,
    accessToken,
  };
};

// User Registration Using Google
export const userRegisterUsingGoogle = async (
  user: { name: string; email: string; dp: string },
  dbUserRepository: ReturnType<UserDBInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  try {
    const username =
      user.name.toLocaleLowerCase().replace(/\s/g, "") +
      Math.floor(Math.random() * 100);
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const newPassword = await authService.encryptPassword(generatedPassword);

    const userData: GoogleUserInterface = {
      name: user.name,
      email: user.email,
      username,
      password: newPassword,
      dp: user.dp,
      isGoogleSignedIn: true,
    };

    const savedUser = await dbUserRepository.addUser(userData);

    const role = "user";

    const refreshToken = authService.generateRefreshToken({
      userId: savedUser._id.toString(),
      role,
    });
    const accessToken = authService.generateAccessToken({
      userId: savedUser._id.toString(),
      role,
    });
    await dbUserRepository.addRefreshTokenAndExpiry(
      userData?.email,
      refreshToken
    );

    return {
      userDetails: savedUser,
      refreshToken,
      accessToken,
    };
  } catch (error) {
    throw new ErrorInApplication("Failed to register user with Google", 500);
  }
};

// User Login Using Google
export const userLoginUsingGoogle = async (
  user: { name: string; email: string; dp: string },
  dbUserRepository: ReturnType<UserDBInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  try {
    const existingUser: any = await dbUserRepository.getUserByEmail(user.email);
    if (!existingUser) {
      throw new ErrorInApplication("User not found", 404);
    }

    if (existingUser.isBlocked) {
      throw new ErrorInApplication("Your account has been blocked", 404);
    }

    const role = existingUser.isAdmin ? "admin" : "user";
    const refreshToken = authService.generateRefreshToken({
      userId: existingUser._id.toString(),
      role,
    });
    const accessToken = authService.generateAccessToken({
      userId: existingUser._id.toString(),
      role,
    });
    await dbUserRepository.addRefreshTokenAndExpiry(user?.email, refreshToken);

    return {
      userDetails: existingUser,
      refreshToken,
      accessToken,
    };
  } catch (error) {
    throw new ErrorInApplication("Failed to log in user with Google", 500);
  }
};
