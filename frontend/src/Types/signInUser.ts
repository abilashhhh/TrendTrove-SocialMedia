
export interface SignInUserInterface {
    email: string,
    password: string
}

export interface User {
    _doc: any;
    _id?: string;
    name: string;
    username?: string;
    email: string;
    phone?: number;
    password?: string;
    dp?: string;
    coverPhoto?: string;
    bio?: string;
    gender?: string;
    address?: string;
    followers?: string[];
    following?: string[];
    requestsForMe?: string[];
    requestedByMe?: string[];
    savedPosts?: string[];
    taggedPosts?: string[];
    blockedUsers?: string[]; 
    isVerifiedAccount?: boolean;
    isGoogleSignedIn?: boolean;
    isBlocked?: boolean;
    isPrivate?: boolean;
    isPremium?: boolean;
    isAdmin?: boolean;
    createdAt?: string;
}

export interface SignInUserResponse {
    user: User | null;
    accessToken: string | null;
    message: string,
    status: string,
}

export interface GoogleLoginInterface {
    name: string,
    email: string,
    dp : string,
}

export interface GoogleLoginResponse {
    status: string;
    message: string,
    refreshToken?: string;
    accessToken?: string;
    user: User | null;
  }

export interface LogoutResponse {
    status: string,
    message: string,    
}

export interface generateOtpResponse {
    status: string,
    message: string,    
}

export interface VerifyOtpResponse {
    status: string, 
    message: string,
}

export interface ResetPasswordResponse {
    status: string,
    message: string,
}