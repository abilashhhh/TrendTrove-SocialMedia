import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import ErrorInApplication from "../../utils/ErrorInApplication";
import { AuthService } from "../../frameworks/services/authenticationService";
import { AuthServiceInterface } from "../../application/services/authenticationServiceInterface";
import { UserDBInterface } from "../../application/repositories/userDBRepository";
import { UserRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/userRepositoryDatabase";

import {
  handleAcceptFollowUserRequest,
  handleBlockUser,
  handleCancelFollowUserRequest,
  handleFollowUserRequest,
  handleGetAllUsers,
  handleRejectFollowUserRequest,
  handleUnBlockUser,
  handleUnFollowUserRequest,
  handleUserInfo,
  handleUserbyUsername,
} from "../../application/use-cases/profile/profileAuthApplication";

const userController = (
  userDBRepositoryImplementation: UserRepositoryMongoDB,
  userDBRepositoryInterface: UserDBInterface,
  authServiceImplementation: AuthService,
  authServiceInterface: AuthServiceInterface
) => {
  const dbUserRepository = userDBRepositoryInterface(
    userDBRepositoryImplementation()
  );
  const authService = authServiceInterface(authServiceImplementation());

  const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userId }: { userId: string } = req.body;
    const user = await handleGetAllUsers(userId, dbUserRepository);
    res.json({
      status: "success",
      message: "All users info fetched",
      user,
    });
  });

  const getuserprofile = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const user = await handleUserbyUsername(username, dbUserRepository);
    res.json({
      status: "success",
      message: "User info fetched",
      user,
    });
  });

  const followUserRequest = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, targetUserId } = req.body;
      const result = await handleFollowUserRequest(
        userId,
        targetUserId,
        dbUserRepository
      );
      res.json({
        status: "success",
        message: result.message,
        user: result.user,
      });
    }
  );

  const unfollowUserRequest = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, targetUserId } = req.body;
      const result = await handleUnFollowUserRequest(
        userId,
        targetUserId,
        dbUserRepository
      );
      res.json({
        status: "success",
        message: result.message,
        user: result.user,
      });
    }
  );

  const cancelfollowUserRequest = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, targetUserId } = req.body;
      const result = await handleCancelFollowUserRequest(
        userId,
        targetUserId,
        dbUserRepository
      );
      res.json({
        status: "success",
        message: result.message,
        user: result.user,
      });
    }
  );

  const acceptfollowUserRequest = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, targetUserId } = req.body;
      const result = await handleAcceptFollowUserRequest(
        userId,
        targetUserId,
        dbUserRepository
      );
      res.json({
        status: "success",
        message: result.message,
        user: result.user,
      });
    }
  );

  const rejectfollowUserRequest = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId, targetUserId } = req.body;
      const result = await handleRejectFollowUserRequest(
        userId,
        targetUserId,
        dbUserRepository
      );
      res.json({
        status: "success",
        message: result.message,
        user: result.user,
      });
    }
  );

  const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId, blockUserId } = req.body;
    const result = await handleBlockUser(userId, blockUserId, dbUserRepository);
    res.json({
      status: "success",
      message: result.message,
      user: result.user,
    });
  });

  const unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId, unblockUserId } = req.body;
    const result = await handleUnBlockUser(
      userId,
      unblockUserId,
      dbUserRepository
    );
    res.json({
      status: "success",
      message: result.message,
      user: result.user,
    });
  });

  return {
    getAllUsers,
    getuserprofile,
    followUserRequest,
    cancelfollowUserRequest,
    acceptfollowUserRequest,
    unfollowUserRequest,
    rejectfollowUserRequest,
    blockUser,
    unblockUser,
  };
};

export default userController;
