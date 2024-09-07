"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorInApplication_1 = __importDefault(require("../../../utils/ErrorInApplication"));
const errorHandlingMiddleware = (err, req, res, next) => {
    console.error("Error from errorHandlingMiddleware:", err);
    let statusCode = err instanceof ErrorInApplication_1.default ? err.statusCode : 500;
    let status = err instanceof ErrorInApplication_1.default ? err.status : "error";
    let message = err instanceof ErrorInApplication_1.default
        ? err.message
        : "An unexpected error occurred";
    console.log("Error middleware:", { status, message });
    res.status(statusCode).json({ status, message });
};
exports.default = errorHandlingMiddleware;
