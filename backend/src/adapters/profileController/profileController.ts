import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorInApplication from "../../utils/ErrorInApplication";
import { AuthService } from "../../frameworks/services/authenticationService";
import { AuthServiceInterface } from "../../application/services/authenticationServiceInterface";
import { UserDBInterface } from "../../application/repositories/userDBRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/userRepositoryDatabase";

import {
  handleEditProfile,
  handlePasswordChange,
  handleUserInfo,
  handleDeleteAccount,
  handleSuspendAccount,
  handlePrivateAccount,
  handleRazorpayOrder,
  handleVerifyPassword,
  handleVerifiedAccountPayment,
  handleSetPremiumAccount,
  handleverifydocspremium,
  handlePremiumAccountUserProgress,
  handlePublicAccount,
  handlePasswordChange2,
} from "../../application/use-cases/profile/profileAuthApplication";
import { ProfileInterface } from "../../types/profileInterface";
import Razorpay from "razorpay";

const profileController = (
  userDBRepositoryImplementation: UserRepositoryMongoDB,
  userDBRepositoryInterface: UserDBInterface,
  authServiceImplementation: AuthService,
  authServiceInterface: AuthServiceInterface
) => {
  const dbUserRepository = userDBRepositoryInterface(
    userDBRepositoryImplementation()
  );
  const authService = authServiceInterface(authServiceImplementation());

  const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    // console.log("Get user info2 ran : ", userId);
    const user = await handleUserInfo(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "User info fetched",
      user,
    });
  });

  const editProfile = asyncHandler(async (req: Request, res: Response) => {
    const profileInfo: ProfileInterface = req.body;
    const userData = await handleEditProfile(profileInfo, dbUserRepository);
    res.json({
      status: "success",
      message: "User edited successfully",
      userData,
    });
  });

  const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { _id, currentPassword, newPassword } = req.body;
    const userData = await handlePasswordChange(
      _id,
      currentPassword,
      newPassword,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Password changed successfully",
      userData,
    });
  });
  const changePassword2 = asyncHandler(async (req: Request, res: Response) => {
    const { _id, newPassword } = req.body;
    const userData = await handlePasswordChange2(
      _id,
      newPassword,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Password changed successfully",
      userData,
    });
  });

  const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id, password } = req.params;
    const result = await handleDeleteAccount(
      id,
      password,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Account deleted successfully",
      result,
    });
  });

  const suspendAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id, password } = req.params;
    const result = await handleSuspendAccount(
      id,
      password,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Account suspended successfully",
      result,
    });
  });

  const privateAccount = asyncHandler(async (req: Request, res: Response) => {
    const { id, password } = req.params;
    const result = await handlePrivateAccount(
      id,
      password,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Account set to private successfully",
      result,
    });
  });

  const publicaccount = asyncHandler(async (req: Request, res: Response) => {
    const { id, password } = req.params;
    const result = await handlePublicAccount(
      id,
      password,
      dbUserRepository,
      authService
    );
    res.json({
      status: "success",
      message: "Account set to public successfully",
      result,
    });
  });

  const verifyPassword = asyncHandler(async (req: Request, res: Response) => {
    const { id, password } = req.params;

    try {
      const result = await handleVerifyPassword(
        id,
        password,
        dbUserRepository,
        authService
      );
      res.json({
        status: "success",
        message: "Password verified successfully",
        result,
      });
    } catch (error: any) {
      console.log("error in verify pass");
      res.status((error as ErrorInApplication).statusCode || 500).json({
        status: "error",
        message: error.message || "Failed to verify password",
      });
    }
  });

  const premiumaccountuserprogress = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body
    try {
      const result = await handlePremiumAccountUserProgress(
        userId,
        dbUserRepository,
        authService
      );
      res.json({
        status: "success",
        message: "premiumaccountuserprogress receivec successfully",
        result,
      });
    } catch (error: any) {
      console.log("error in handlePremiumAccountUserProgress");
      res.status((error as ErrorInApplication).statusCode || 500).json({
        status: "error",
        message: error.message || "Failed to get premium account userr progress",
      });
    }
  });

  const makeVerifiedAccountPayment = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId }: { userId: string } = req.body;

      try {
        const order = await handleVerifiedAccountPayment(
          userId,
          dbUserRepository,
          authService
        );
        res.json({
          status: "success",
          message: "Premium account payment completed successfully",
          order,
        });
      } catch (error: any) {
        console.log("error in completing payment");
        res.status((error as ErrorInApplication).statusCode || 500).json({
          status: "error",
          message: error.message || "Failed to completing payment",
        });
      }
    }
  );

  const setPremiumAccount = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, paymentId } = req.body;
      try {
        console.log("setPremiumAccount reached, ", userId, paymentId);
        const order = await handleSetPremiumAccount(
          userId,
          paymentId,
          dbUserRepository,
          authService
        );
        res.json({
          status: "success",
          message:
            "Premium account payment completed  and submitted   successfully",
          order,
        });
      } catch (error: any) {
        console.log("error in completing payment");
        res.status((error as ErrorInApplication).statusCode || 500).json({
          status: "error",
          message: error.message || "Failed  account payment and  submission ",
        });
      }
    }
  );

  const toverifydocspremium = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, documentType, images } = req.body;
      try {
        console.log(
          "toverifydocspremium reached, ",
          userId,
          documentType,
          images
        );
        const order = await handleverifydocspremium(
          userId,
          documentType,
          images,
          dbUserRepository,
          authService
        );
        res.json({
          status: "success",
          message:
            "Premium account payment completed  and submitted for verification successfully",
          order,
        });
      } catch (error: any) {
        console.log("error in completing payment");
        res.status((error as ErrorInApplication).statusCode || 500).json({
          status: "error",
          message:
            error.message || "Failed  account payment and  verification ",
        });
      }
    }
  );

  return {
    getUserInfo,
    editProfile,
    changePassword,
    changePassword2,
    deleteAccount,
    suspendAccount,
    privateAccount,
    verifyPassword,
    makeVerifiedAccountPayment,
    setPremiumAccount,
    toverifydocspremium,
    publicaccount,
    premiumaccountuserprogress
  };
};

export default profileController;
