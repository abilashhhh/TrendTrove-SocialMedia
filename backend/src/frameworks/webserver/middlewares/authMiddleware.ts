import { Request, Response, NextFunction } from "express";
import configurationKeys from "../../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../database/mongodb/models/userModel";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.header("authorization")?.split(" ")[1];
    token = token?.replaceAll('"', "");
    if (token) {
      const decryptedToken = jwt.verify(
        token,
        configurationKeys.JWT_ACCESS_CODE
      ) as JwtPayload;
      req.body.userId = decryptedToken.userId;
      const user = await User.findOne({
        _id: decryptedToken.userId,
        isBlocked: true,
      });
      if (user && req.path !== "/logout") {
        res.status(401).json({
          success: "error",
          message: "User is blocked",
        });
      } else {
        next();
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export default authMiddleware;
