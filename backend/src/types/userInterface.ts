export interface UserInterface {
  name: string;
  username: string;
  email: string;
  phone?: number;
  password: string;
  dp?: string;
  coverPhoto?: string;
  bio?: string;
  gender?: string;
  address?: string;
  requestsForMe?: string[];
  requestedByMe?: string[];
  followers?: string[];
  following?: string[];
  savedPosts?: string[];
  blockedUsers?: string[];
  isVerifiedAccount?: boolean;
  isGoogleSignedIn?: boolean;
  isBlocked?: boolean;
  isPrivate?: boolean;
  isPremium?: boolean;
  createdAt?: string;
}

export interface GoogleUserInterface {
  name: string;
  username?: string;
  email: string;
  phone?: number;
  password?: string;
  dp?: string;
  isGoogleSignedIn?: boolean;
  coverPhoto?: string;
  bio?: string;
  gender?: string;
  address?: string;
  followers?: string[];
  following?: string[];
  requestsForMe?: string[];
  requestedByMe?: string[];
  blockedUsers?: string[];
  savedPosts?: string[];
  isVerifiedAccount?: boolean;
  isBlocked?: boolean;
  isPrivate?: boolean;
  isPremium?: boolean;
  createdAt?: string;
}

export interface UserDataInterface {
  id?: string;
  name: string;
  username: string;
  email: string;
  phone?: number;
  password: string;
  dp?: string;
  coverPhoto?: string;
  bio?: string;
  gender?: string;
  address?: string;
  requestsForMe?: string[];
  requestedByMe?: string[];
  followers?: string[];
  following?: string[];
  blockedUsers?: string[];
  savedPosts?: string[];
  isVerifiedAccount?: boolean;
  isGoogleSignedIn?: boolean;
  isBlocked?: boolean;
  isPrivate?: boolean;
  isPremium?: boolean;
  createdAt?: string;
}
