import express from "express";
import authController from "../../../adapters/authController/authController";
import { authService } from "../../services/authenticationService";
import { authServiceInterface } from "../../../application/services/authenticationServiceInterface";
import { userRepositoryMongoDB } from "../../database/mongodb/respositories/userRepositoryDatabase";
import { userDBRepository } from "../../../application/repositories/userDBRepository";
import { otpRepositoryMongoDB } from "../../database/mongodb/respositories/otpRepositoryDatabase";
import { otpDbRepository } from "../../../application/repositories/OTPDBRepository";
import { mailSenderService } from "../../services/mailSendService";
import { mailSenderServiceInterface } from "../../../application/services/mailServiceInterface";
import authMiddleware from "../middlewares/authMiddleware";
const authRouter = () => {
  const router = express();

  const controller = authController(
    authService,
    authServiceInterface,
    userRepositoryMongoDB,
    userDBRepository,
    otpRepositoryMongoDB,
    otpDbRepository,
    mailSenderService,
    mailSenderServiceInterface
  );

  router.post("/signup", controller.registerUser);
  router.post("/signin", controller.signIn);
  router.post("/googlesigninup", controller.loginOrSignUpUsingGoogle);
  router.get("/usernameavailablity/:username", controller.usernameAvailability);
  router.get("/emailavailability/:email", controller.emailAvailability);
  router.post("/generateotp", controller.sendOtp);
  router.post("/verifyotp", controller.verifyOtpForEmailVerification);
  router.get("/refreshtoken", controller.refreshAccessToken);
  router.delete("/logout", authMiddleware, controller.logoutUser);
  router.post("/forgotpassword", controller.forgotPassword);
  router.post("/forgotpasswordchange", controller.forgotpasswordchange);

  return router;
};

export default authRouter;
