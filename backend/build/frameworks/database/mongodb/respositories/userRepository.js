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
exports.userRepositoryMongoDB = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const userRepositoryMongoDB = () => {
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = new userModel_1.default(user);
            return yield newUser.save();
        }
        catch (error) {
            console.log(error);
            throw new Error("Error adding user!");
        }
    });
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findOne({ email });
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting user by email!");
        }
    });
    const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('repo ;', username);
            const user = yield userModel_1.default.findOne({ username });
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error getting user by username!");
        }
    });
    return {
        addUser,
        getUserByEmail,
        getUserByUsername,
    };
};
exports.userRepositoryMongoDB = userRepositoryMongoDB;
