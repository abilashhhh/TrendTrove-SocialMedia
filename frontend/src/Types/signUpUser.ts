export interface SignUpUserInterface {
  name: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  address?: string;
  isBlocked?: boolean;
  isPrivate?: boolean;
  isVerifiedAccount?: boolean;
  isGoogleSignedIn?: boolean;
  isPremium?: boolean;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: Date | null;
  posts?: any[];
  requestsForMe?: any[];
  requestedByMe?: any[];
  followers?: any[];
  following?: any[];
  savedPosts?: any[];
  notifications?: any[];
  blockedUsers?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignupUserResponse {
  message?: string;
  status: string;
}

export interface UsernameAvailabilityResponse {
  available: boolean;
  status: string;
}

export interface EmailAvailabilityResponse {
  available: boolean;
  status: string;
}


export interface forgotPassword{
  message?: string;
  status?: string;
}