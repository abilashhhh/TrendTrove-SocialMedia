import { Document, Schema, model } from "mongoose";
import { OtpInterface } from "../../../../types/otpInterface";

const otpSchema = new Schema<OtpInterface>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1 * 60,
  },
});

const Otp = model<OtpInterface>("Otp", otpSchema);
export default Otp;
