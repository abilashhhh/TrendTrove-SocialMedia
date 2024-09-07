import express from "express";
import adminMiddleware from "../middlewares/adminMiddleware";
import { authServiceInterface } from "../../../application/services/authenticationServiceInterface";
import { authService } from "../../services/authenticationService";
import { userRepositoryMongoDB } from "../../database/mongodb/respositories/userRepositoryDatabase";
import { userDBRepository } from "../../../application/repositories/userDBRepository";
import adminController from "../../../adapters/adminController/adminController";
import { postDBRepository } from "../../../application/repositories/postDBRepository";
import { postRepositoryMongoDB } from "../../database/mongodb/respositories/postRepositoryDatabase";

const adminRouter = () => {
  const router = express();

  const controller = adminController(
    userRepositoryMongoDB,
    userDBRepository,
    postRepositoryMongoDB,
    postDBRepository,
    authService,
    authServiceInterface
  );

  router.delete("/logout", adminMiddleware ,controller.logout);
  router.get("/getusersforadmin",adminMiddleware, controller.getAllUsersForAdmin);
  router.get("/getallpostreportsandposts",adminMiddleware, controller.getallpostreports);
  router.get("/getpremiumaccountrequests",adminMiddleware, controller.getpremiumaccountrequests);
  router.patch("/blockuser/:id" ,adminMiddleware,controller.blockAccount);
  router.patch("/unblockuser/:id" ,adminMiddleware,controller.unblockAccount);
  router.patch("/blockpost/:postId" ,adminMiddleware,controller.blockPost);
  router.patch("/unblockpost/:postId" ,adminMiddleware,controller.unblockPost);
  router.patch("/approvepremium/:userId" ,adminMiddleware,controller.approvepremium);
  router.patch("/removepremium/:userId" ,adminMiddleware,controller.removepremium);

 
 
  return router;
};

export default adminRouter;
