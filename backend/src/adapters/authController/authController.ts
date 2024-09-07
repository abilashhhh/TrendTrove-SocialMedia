import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorInApplication from "../../utils/ErrorInApplication";
import { AuthService } from "../../frameworks/services/authenticationService";
import { AuthServiceInterface } from "../../application/services/authenticationServiceInterface";
import { UserDBInterface } from "../../application/repositories/userDBRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/userRepositoryDatabase";
import { OtpDbInterface } from "../../application/repositories/OTPDBRepository";
import { OtpRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/otpRepositoryDatabase";
import { MailSenderService } from "../../frameworks/services/mailSendService";
import { MailSenderServiceInterface } from "../../application/services/mailServiceInterface";
import { UserInterface } from "../../types/userInterface";

import {
  accessTokenRefresh,
  handleLogoutUser,
  handleOtpVerification,
  handleSendOtp,
  userRegister,
  handleGoogleLoginOrSignup,
  handleForgotPasswordChange,
  login,
} from "../../application/use-cases/auth/userAuthApplication";

const authController = (
  authServiceImplementation: AuthService,
  authServiceInterface: AuthServiceInterface,
  userDBRepositoryImplementation: UserRepositoryMongoDB,
  userDBRepositoryInterface: UserDBInterface,
  otpDBRepositoryImplementation: OtpRepositoryMongoDB,
  otpDbRepositoryInterface: OtpDbInterface,
  mailSenderServiceImplementation: MailSenderService,
  mailSenderServiceInterface: MailSenderServiceInterface
) => {
  const authService = authServiceInterface(authServiceImplementation());
  const dbUserRepository = userDBRepositoryInterface(
    userDBRepositoryImplementation()
  );
  const dbOtpRepository = otpDbRepositoryInterface(
    otpDBRepositoryImplementation()
  );
  const mailSenderService = mailSenderServiceInterface(
    mailSenderServiceImplementation()
  );

  const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const user: UserInterface = req.body;
    await userRegister(user, dbUserRepository, authService);
    res.status(200).json({
      status: "success",
      message: "User registered successfully",
    });
  });

  const usernameAvailability = asyncHandler(
    async (req: Request, res: Response) => {
      const { username } = req.params;
      const isAvailable = await dbUserRepository.getUserByUsername(username);
      if (!isAvailable) {
        res.json({
          available: true,
          status: "Username is available",
        });
      } else {
        res.json({
          available: false,
          status: "Username not available",
        });
      }
    }
  );

  const emailAvailability = asyncHandler(
    async (req: Request, res: Response) => {
      const { email } = req.params;
      const isUsed = await dbUserRepository.getUserByEmail(email);
      if (!isUsed) {
        res.json({
          available: true,
          status: "",
        });
      } else {
        res.json({
          available: false,
          status: "Email id already registered, Try logging in",
        });
      }
    }
  );

  const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, text } = req.body;
    const isUsed = await dbUserRepository.getUserByEmail(email);
    if (isUsed) {
      await handleSendOtp(email, text, dbOtpRepository, mailSenderService);
      res.json({
        status: "success",
        message: "OTP sent to the given mail id",
      });
    } else {
      res.json({
        status: "error",
        message: "Email id not registered, Try signing up",
      });
    }
  });

  const forgotpasswordchange = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, password } = req.body;
      const isAvailable = await dbUserRepository.getUserByEmail(email);
      if (isAvailable) {
        let userId = isAvailable._id.toString();
        await handleForgotPasswordChange(
          userId,
          password,
          authService,
          dbUserRepository
        );
        res.json({
          status: "success",
          message: "Password changed successfully",
        });
      } else {
        res.json({
          status: "error",
          message: "Email id not registered, Try signing up",
        });
      }
    }
  );

  const sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, text }: { email: string; text: string } = req.body;
    await handleSendOtp(email, text, dbOtpRepository, mailSenderService);
    res.json({
      status: "success",
      message: "OTP sent",
    });
  });

  const verifyOtpForEmailVerification = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, otp }: { email: string; otp: string } = req.body;
      const isOtpValid = await handleOtpVerification(
        email,
        otp,
        dbOtpRepository
      );
      if (isOtpValid) {
        res.json({
          status: "success",
          message: "OTP verified",
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Invalid OTP",
        });
      }
    }
  );

  const signIn = asyncHandler(async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    const { userDetails, refreshToken, accessToken } = await login(
      email,
      password,
      dbUserRepository,
      authService
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: "success",
      message: "user verified",
      user: userDetails,
      accessToken,
    });
  });

  const loginOrSignUpUsingGoogle = asyncHandler(
    async (req: Request, res: Response) => {
      const user = req.body;
      const { userDetails, refreshToken, accessToken } =
        await handleGoogleLoginOrSignup(user, dbUserRepository, authService);

      // console.log(
      //   "UserDetails in loginOrSignUpUsingGoogle from adapterd: ",
      //   userDetails,
      //   refreshToken,
      //   accessToken
      // );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password, ...userDetailsWithoutPassword } = userDetails._doc;

      // console.log("Returning user details: ", userDetailsWithoutPassword);

      res.json({
        status: "success",
        message: "User verified",
        user: userDetailsWithoutPassword,
        accessToken,
      });
    }
  );

  const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
      const cookies: any = req.cookies;
      // console.log("Consoling cookies from the refreshaccesstoken : ", cookies);
      const accessToken = await accessTokenRefresh(
        cookies,
        dbUserRepository,
        authService
      );

      res.json({ accessToken });
    }
  );

  const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const cookies = req.cookies;
    if (!cookies?.refreshToken) {
      res.sendStatus(204);
      return;
    }
    await handleLogoutUser(userId, dbUserRepository);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
    });
    res.json({
      status: "success",
      message: "Cookie Cleared",
    });
  });

  return {
    registerUser,
    usernameAvailability,
    sendOtp,
    verifyOtpForEmailVerification,
    emailAvailability,
    signIn,
    refreshAccessToken,
    logoutUser,
    loginOrSignUpUsingGoogle,
    forgotPassword,
    forgotpasswordchange,
  };
};

export default authController;
