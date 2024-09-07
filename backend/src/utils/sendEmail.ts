import nodemailer from "nodemailer";
import configurationKeys from "../config";

const sendMail = async (email: string, title: string, body: string) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: configurationKeys.MAIL_USERNAME,
        pass: configurationKeys.MAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: configurationKeys.MAIL_USERNAME,
      to: email,
      subject: title,
      html: body,
    });
    // console.log("Email info: ", info);

    return info;
  } catch (error) {
    console.log("Error in sendMail - Utils ", error);
  }
};

export default sendMail;
