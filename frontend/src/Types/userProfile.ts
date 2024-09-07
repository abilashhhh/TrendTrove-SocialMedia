export interface GetUserInfoResponse {
  status: string;
  message: string;
  user: UserInfo;
}

export interface UserInfo {
  _id: any;
  id: any;
  // userId:string
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
  isBlocked?: boolean;
  isPrivate?: boolean;
  isDarkMode?: boolean;
  isLeftSidebarOpen?: boolean;
  isRightSidebarOpen?: boolean;
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
  taggedPosts?: any[];
  notifications?: any[];
  blockedUsers?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EditProfileResponse {
  status: string;
  message: string;
  user: UserInfo;
}

export interface ChangePasswordResponse {
  status: string;
  message: string;
}

export interface ChangePasswordInterface {
  _id: string;
  currentPassword: string;
  newPassword: string;
}
export interface ChangePasswordInterface2 {
  _id: string;
  newPassword: string;
}

export interface DeleteAccountResponse {
  status: string;
  message: string;
}

export interface SuspendAccountResponse {
  status: string;
  message: string;
}
export interface PremiumAccountResponse {
  status: string;
  message: string;
}

export interface PasswordCheckResponse {
  status: string;
  message: string;
}

export interface DocumentSupportTypes {
  userId: string;
  documentType: string;
  images: string[];
}

export interface DocsSubmittedkResponse {
  status: string;
  message: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
}

export interface GetOtherUserInfoResponse {
  status: string;
  message: string;
  otherUser: UserInfo;
}

export interface GetProfileResponse {
  status: string;
  message: string;
  user: UserInfo;
}

export interface GetRestOfUsersResponse {
  status: string;
  message: string;
  users: UserInfo[];
}

export interface FriendRequestSentResponse {
  status: string;
  message: string;
}

export interface blockUserResponse {
  status: string;
  message: string;
}

export interface UploadCoverResponse {
  status: string;
  message: string;
  coverPhoto: string;
}

export interface UploadDpResponse {
  url: string | undefined;
  status: string;
  message: string;
  dp: string;
}

interface DocumentSchema {
  type: string;
  image: string[];
}

interface PremiumRequest {
  isRequested: boolean;
  isAdminApproved: boolean;
  documents: DocumentSchema[];
}

export interface PremiumAccountInterface extends Document {
  hasExpired: any;
  userId: String;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  paymentDetails?: string;
  premiumRequest: PremiumRequest;
  createdAt: Date;
  updatedAt: Date;
}

export interface PremiumAccountProgressInterface {
  status: string;
  message: string;
  result: PremiumAccountInterface;
}

export interface sendMessageInterface {
  error: any;
  status: string;
  message: string;
}

export interface Message {
  fileType: string;
  mediaUrl: string;
  shouldShake: boolean;
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetMessageInterface {
  error: any;
  status: string;
  message: string;
  data: Message[];
}


export interface modesChangingInterface {
  status: string;
  message: string;
}

export interface generateZegoTokenInterface {
  generateZegoTokenResult: any;
  token: string;
}