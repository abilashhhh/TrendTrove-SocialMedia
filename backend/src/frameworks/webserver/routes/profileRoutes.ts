import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { authServiceInterface } from "../../../application/services/authenticationServiceInterface";
import { authService } from "../../services/authenticationService";
import { userRepositoryMongoDB } from "../../database/mongodb/respositories/userRepositoryDatabase";
import { userDBRepository } from "../../../application/repositories/userDBRepository";
import profileController from "../../../adapters/profileController/profileController";

const profileRouter = () => {
  const router = express() 

  const controller = profileController(
    userRepositoryMongoDB,
    userDBRepository,
    authService,
    authServiceInterface
  );

  router.get("/getuserinfo", authMiddleware, controller.getUserInfo);
  router.patch("/editprofile", authMiddleware, controller.editProfile);
  router.patch("/changepassword", authMiddleware, controller.changePassword);
  router.patch("/changepassword2", authMiddleware, controller.changePassword2);
  router.delete("/deleteaccount/:id/:password", authMiddleware, controller.deleteAccount);
  router.patch("/suspendaccount/:id/:password", authMiddleware, controller.suspendAccount);
  router.patch("/privateaccount/:id/:password", authMiddleware, controller.privateAccount);
  router.patch("/publicaccount/:id/:password", authMiddleware, controller.publicaccount);
  router.get("/verifypassword/:id/:password", authMiddleware, controller.verifyPassword);
  router.post("/makepayment",  authMiddleware, controller.makeVerifiedAccountPayment);
  router.post("/premiumaccount" ,authMiddleware , controller.setPremiumAccount);
  router.post("/toverifydocspremium" ,authMiddleware , controller.toverifydocspremium);
  router.get("/premiumaccountuserprogress" ,authMiddleware , controller.premiumaccountuserprogress);

  return router;
};

export default profileRouter;
