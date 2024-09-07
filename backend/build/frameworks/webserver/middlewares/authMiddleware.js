"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../database/mongodb/models/userModel"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        token = token === null || token === void 0 ? void 0 : token.replaceAll('"', "");
        if (token) {
            const decryptedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_CODE);
            req.body.userId = decryptedToken.userId;
            const user = yield userModel_1.default.findOne({
                _id: decryptedToken.userId,
                isBlocked: true,
            });
            if (user && req.path !== "/logout") {
                res.status(401).json({
                    success: "error",
                    message: "User is blocked",
                });
            }
            else {
                next();
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Token not found",
            });
        }
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
});
exports.default = authMiddleware;
