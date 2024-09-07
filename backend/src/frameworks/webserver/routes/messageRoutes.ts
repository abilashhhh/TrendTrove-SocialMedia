import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { authServiceInterface } from "../../../application/services/authenticationServiceInterface";
import { authService } from "../../services/authenticationService";
import { userDBRepository } from "../../../application/repositories/userDBRepository";
import { userRepositoryMongoDB } from "../../database/mongodb/respositories/userRepositoryDatabase";
import { postRepositoryMongoDB } from "../../database/mongodb/respositories/postRepositoryDatabase";
import { postDBRepository } from "../../../application/repositories/postDBRepository";
import messageController from "../../../adapters/messageController/messageController";
import { messageDBRepository } from "../../../application/repositories/MessageDBRepository";
import { messageRepositoryMongoDB } from "../../database/mongodb/respositories/messageRepositoryDatabase";

const messageRoutes = () => {
  const router = express.Router();

  const controller = messageController(
    userRepositoryMongoDB,
    userDBRepository,
    postRepositoryMongoDB,
    postDBRepository,
    authService,
    authServiceInterface,
    messageRepositoryMongoDB,
    messageDBRepository
  );

  router.post("/sendMessages/:receiverId", authMiddleware, controller.sendMessage);
  router.post("/sendMessagesOnly/:receiverId", authMiddleware, controller.sendMessageOnly);
  router.get("/getMessages/:receiverId", authMiddleware, controller.getMessages);
  router.get("/getAllConverations", authMiddleware, controller.getAllConverations);
  router.get("/getfriendsinfo", authMiddleware, controller.getFriendsInfo);
  router.patch("/editmessage/:messageId", authMiddleware, controller.editMessage);
  router.patch("/deletemessage/:messageId", authMiddleware, controller.deleteMessage);
  router.get("/generatezegotoken", authMiddleware, controller.generateZegoToken);

  return router;
};

export default messageRoutes;
