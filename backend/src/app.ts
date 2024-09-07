import express, { Application, Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import connectToMongoDB from "./frameworks/database/mongodb/connection";
import expressConfigurations from "./frameworks/webserver/express";
import routes from "./frameworks/webserver/routes";
import errorHandlingMiddleware from "./frameworks/webserver/middlewares/errorHandlingMiddleware";
import serverConfigurations from "./frameworks/webserver/server";
import ErrorInApplication from "./utils/ErrorInApplication";
import { socket } from "./frameworks/websocket/socket";
import configurationKeys from "./config";

const app: Application = express();

connectToMongoDB();

expressConfigurations(app);
routes(app);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorInApplication("Request not found", 404));
});

app.use(errorHandlingMiddleware);

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: configurationKeys.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
  },
});

socket(io);

serverConfigurations(server).startServer();

export { io };
export default app;
