import { UserRepositoryMongoDB } from "../../frameworks/database/mongodb/respositories/userRepositoryDatabase";
import { PostDataInterface } from "../../types/postsInterface";
import { ProfileInterface } from "../../types/profileInterface";
import { UserInterface, GoogleUserInterface } from "../../types/userInterface";

export const userDBRepository = (
  repository: ReturnType<UserRepositoryMongoDB>
) => {
  const addUser = async (user: UserInterface | GoogleUserInterface) =>
    await repository.addUser(user);

  const getUserByEmail = async (email: string) =>
    await repository.getUserByEmail(email);

  const getUserById = async (userId: string) =>
    await repository.getUserById(userId);

  const getUserByUsername = async (username: string) =>
    await repository.getUserByUsername(username);

  const logoutUser = async (userId: string) =>
    await repository.logoutUser(userId);

  const addRefreshTokenAndExpiry = async (
    email: string,
    refreshToken: string
  ) => {
    await repository.addRefreshTokenAndExpiry(email, refreshToken);
  };

  const changeIsAccountVerified = async (email: string) =>
    await repository.changeIsAccountVerified(email);

  const changeIsAccountUnverified = async (userId: string) =>
    await repository.changeIsAccountUnverified(userId);

  const updateProfile = async (profileInfo: ProfileInterface) =>
    await repository.updateProfile(profileInfo);

  const updatePassword = async (_id: string, encryptedNewPassword: string) =>
    await repository.updatePassword(_id, encryptedNewPassword);

  const deleteAccount = async (userId: string) =>
    await repository.deleteAccount(userId);

  const suspendAccount = async (userId: string) =>
    await repository.suspendAccount(userId);

  const blockAccount = async (userId: string) =>
    await repository.blockAccount(userId);

  const unblockAccount = async (userId: string) =>
    await repository.unblockAccount(userId);

  const privateAccount = async (userId: string) =>
    await repository.privateAccount(userId);

  const publicAccount = async (userId: string) =>
    await repository.publicAccount(userId);

  const getAllUsers = async (userId: string) =>
    await repository.getAllUsers(userId);

  const getAllUsersForAdmin = async () =>
    await repository.getAllUsersForAdmin();

  const getAllReportsForAdmin = async () =>
    await repository.getAllReportsForAdmin();

  const getAllPremiumRequestsForAdmin = async () =>
    await repository.getAllPremiumRequestsForAdmin();

  const followUser = async (userId: string, targetUserId: string) =>
    await repository.followUser(userId, targetUserId);

  const unfollowUser = async (userId: string, targetUserId: string) =>
    await repository.unfollowUser(userId, targetUserId);

  const cancelSendFriendRequest = async (
    userId: string,
    targetUserId: string
  ) => await repository.cancelSendFriendRequest(userId, targetUserId);

  const acceptFriendRequest = async (userId: string, targetUserId: string) =>
    await repository.acceptFriendRequest(userId, targetUserId);

  const rejectFriendRequest = async (userId: string, targetUserId: string) =>
    await repository.rejectFriendRequest(userId, targetUserId);

  const setPaymentDetails = async (userId: string, paymentId: string) =>
    await repository.setPaymentDetails(userId, paymentId);

  const blockOtherUser = async (userId: string, blockUserId: string) =>
    await repository.blockOtherUser(userId, blockUserId);
  const unblockOtherUser = async (userId: string, unblockUserId: string) =>
    await repository.unblockOtherUser(userId, unblockUserId);

  const premiumUsersProgress = async (userId: string) =>
    await repository.premiumUsersProgress(userId);

  const handleDocumentSubmission = async (
    userId: string,
    documentType: string,
    images: string[]
  ) => await repository.handleDocumentSubmission(userId, documentType, images);

  return {
    addUser,
    getUserByEmail,
    getUserByUsername,
    addRefreshTokenAndExpiry,
    getUserById,
    logoutUser,
    updateProfile,
    updatePassword,
    deleteAccount,
    suspendAccount,
    privateAccount,
    publicAccount,
    changeIsAccountVerified,
    changeIsAccountUnverified,
    getAllUsers,
    getAllUsersForAdmin,
    getAllReportsForAdmin,
    getAllPremiumRequestsForAdmin,
    blockAccount,
    unblockAccount,
    followUser,
    unfollowUser,
    cancelSendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    setPaymentDetails,
    handleDocumentSubmission,
    premiumUsersProgress,
    blockOtherUser,
    unblockOtherUser
  };
};

export type UserDBInterface = typeof userDBRepository;
