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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceInterface = void 0;
const authServiceInterface = (service) => {
    const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
        return yield service.encryptPassword(password);
    });
    const comparePassword = (password, hashedPassword) => {
        return service.comparePassword(password, hashedPassword);
    };
    const generateAccessToken = (payload) => {
        return service.generateAccessToken(payload);
    };
    const generateRefreshToken = (payload) => {
        return service.generateRefreshToken(payload);
    };
    const verifyAccessToken = (token) => {
        return service.verifyAccessToken(token);
    };
    const verifyRefreshToken = (token) => {
        return service.verifyRefreshToken(token);
    };
    return {
        encryptPassword,
        comparePassword,
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken,
    };
};
exports.authServiceInterface = authServiceInterface;
