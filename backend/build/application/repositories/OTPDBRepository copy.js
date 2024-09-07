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
exports.otpDbRepository = void 0;
const otpDbRepository = (repository) => {
    const saveNewOtp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, otp }) { return yield repository.saveNewOtp({ email, otp }); });
    const getLatestOtp = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getLatestOtp(email); });
    return {
        saveNewOtp,
        getLatestOtp,
    };
};
exports.otpDbRepository = otpDbRepository;
