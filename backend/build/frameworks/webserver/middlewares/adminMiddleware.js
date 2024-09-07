"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const adminMiddleware = (req, res, next) => {
    var _a;
    let accessToken = (_a = req.header("authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    accessToken = accessToken === null || accessToken === void 0 ? void 0 : accessToken.replaceAll('"', "");
    if (!accessToken) {
        return res.status(401).json({ message: "Access token not found" });
    }
    try {
        const decryptedToken = jsonwebtoken_1.default.verify(accessToken, config_1.default.JWT_ACCESS_CODE);
        if (decryptedToken.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        req.body.userId = decryptedToken.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid access token" });
    }
};
exports.default = adminMiddleware;
