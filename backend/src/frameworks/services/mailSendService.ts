import sendMail from "../../utils/sendEmail";

export const mailSenderService = () => {
  const sendVerificationEmail = async (email: string, otp: number) => {
    try {
      console.log("OTP FOR VERIFICATION: ", otp);
      const mailResponse = await sendMail(
        email,
        "TRENDTROVE - Email Verification",
        `
                <h1>Welcome to TRENDTROVE</h1>
                <p>Thank you for signing up! Please use the OTP below to verify your email:</p>
                <h2>OTP: ${otp}</h2>
              
                `
      );
      console.log("Sent to :", mailResponse?.accepted[0]);
    } catch (err) {
      console.log("Error in sending verification email: ", err);
      throw err;
    }
  };

  const sendForgotPasswordEmail = async (email: string, otp: number) => {
    try {
      console.log("OTP FOR VERIFICATION: ", otp);

      const mailResponse = await sendMail(
        email,
        "TRENDTROVE - Forgot Password",
        `
                <h1>Password Reset Request</h1>
                <p>We received a request to reset your password. Please use the OTP below to reset your password:</p>
                <p>OTP: ${otp}</p>
               
                `
      );
      console.log("Sent to :", mailResponse?.accepted[0]);
    } catch (err) {
      console.log("Error in sending verification email: ", err);
      throw err;
    }
  };

  return {
    sendVerificationEmail,
    sendForgotPasswordEmail,
  };
};

export type MailSenderService = typeof mailSenderService;
export type MailSenderServiceReturn = ReturnType<MailSenderService>;
