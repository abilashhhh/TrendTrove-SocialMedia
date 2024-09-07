export interface ProfileInterface {
  private _id(
    _id: any,
    profileInfo: ProfileInterface,
    arg2: { new: true }
  ): unknown;
  userId?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: number;
  isSuspended?: string;
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
  taggedPosts?: string[];
  isVerifiedAccount?: boolean;
  isGoogleSignedIn?: boolean;
  isBlocked?: boolean;
  isPrivate?: boolean;
  blockedUsers?: string[];
  isPremium?: boolean;
  createdAt?: string;
}
