import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { authServiceInterface } from "../../../application/services/authenticationServiceInterface";
import { authService } from "../../services/authenticationService";
import { userRepositoryMongoDB } from "../../database/mongodb/respositories/userRepositoryDatabase";
import { userDBRepository } from "../../../application/repositories/userDBRepository";
import userController from "../../../adapters/userController/userController";

const userRouter = () => {
  const router = express();

  const controller = userController(
    userRepositoryMongoDB,
    userDBRepository,
    authService,
    authServiceInterface
  );

  router.get("/getallusers" ,authMiddleware, controller.getAllUsers);
  router.get("/getuserprofile/:username" ,authMiddleware, controller.getuserprofile);
  router.post("/followuser" , authMiddleware, controller.followUserRequest);
  router.post("/unfollowuser" , authMiddleware,controller.unfollowUserRequest);
  router.post("/cancelrequest" ,authMiddleware, controller.cancelfollowUserRequest);
  router.post("/acceptrequest" ,authMiddleware,controller.acceptfollowUserRequest);
  router.post("/rejectrequest" , authMiddleware,controller.rejectfollowUserRequest);
  router.post("/blockuserbyuser" , authMiddleware,controller.blockUser);
  router.post("/unblockuserbyuser" , authMiddleware,controller.unblockUser);

  return router;
};

export default userRouter;
