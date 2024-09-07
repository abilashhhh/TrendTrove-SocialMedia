
import express, { Application, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import configKeys from "../../config";

const expressConfig = (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const corsOptions = {
    origin: ["*", configKeys.CLIENT_URL],
  };

  app.use(cors({ credentials: true, ...corsOptions }));
};

export default expressConfig;
