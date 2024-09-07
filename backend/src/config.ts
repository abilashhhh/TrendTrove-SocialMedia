import dotenv from "dotenv";
dotenv.config();

const configurationKeys = {
  PORT: process.env.PORT,
  MONGODB: process.env.MONGODB as string,
  JWT_ACCESS_CODE: process.env.JWT_ACCESS_CODE as string,
  JWT_REFRESH_CODE: process.env.JWT_REFRESH_CODE as string,
  MAIL_USERNAME: process.env.MAIL_USERNAME as string,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD as string,
  CLIENT_URL: process.env.CLIENT_URL as string,

  ZEGO_CLOUD_APP_ID: parseInt(process.env.ZEGO_CLOUD_APP_ID as string),
  ZEGO_CLOUD_SERVER_SECRET: process.env.ZEGO_CLOUD_SERVER_SECRET as string,
};

export default configurationKeys;
