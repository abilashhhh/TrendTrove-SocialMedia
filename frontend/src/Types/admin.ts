import { ReportPostData } from "./Post";
import {User} from "./signInUser"
import { PremiumAccountInterface } from "./userProfile";

export interface AdminLoginInterface {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    user(arg0: string, user: any): unknown;
    status: string,
    message: string,
    accessToken: string,
}

export interface GetUsersResponse {
    status: string,
    message: string,
    users: User[],
}
export interface GetPostReportsResponse {
    status: string,
    message: string,
    reports: ReportPostData[],
}

export interface GetPremiumAccountResponse {
    status: string,
    message: string,
    premium: PremiumAccountInterface[],
}

export interface BlockUserResponse {
    status: string,
    message: string,
}

export interface UnBlockUserResponse {
    status: string,
    message: string,
}

export interface BlockPostResponse {
    success: boolean;
    message: string;
  }

export interface ApprovePremiumResponse {
    status: string,
    message: string,
}

export interface RemovePremiumResponse {
    success: boolean;
    message: string;
  }