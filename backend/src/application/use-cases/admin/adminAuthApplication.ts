import ErrorInApplication from "../../../utils/ErrorInApplication";
import { PostDBInterface } from "../../repositories/postDBRepository";
import { UserDBInterface } from "../../repositories/userDBRepository";

export const handleGetAllUsersForAdmin = async (
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  try {
    // console.log("handleyeallusers called")
    const user = await dbUserRepository.getAllUsersForAdmin();
    return user;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to get all users data", 401);
  }
};

export const handkeGetallpostreports = async (
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  try {
    // console.log("handkeGetallpostreports called")
    const reports = await dbUserRepository.getAllReportsForAdmin();
    return reports;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to get all users data", 401);
  }
};

export const handkeGetPremiumRequests = async (
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  try {
    // console.log("handkeGetPremiumRequests called")
    const reports = await dbUserRepository.getAllPremiumRequestsForAdmin();
    return reports;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to get all users data", 401);
  }
};

export const handleBlockAccount = async (
  userId: string,
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  try {
    // console.log("Userdetails in handle block: ", userId)
    const userExists = await dbUserRepository.getUserById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    // Update user's password in the database
    const user = await dbUserRepository.blockAccount(userId);

    return user;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to block user", 401);
  }
};

export const handleUnBlockAccount = async (
  userId: string,
  dbUserRepository: ReturnType<UserDBInterface>
) => {
  try {
    // console.log("Userdetails in handle unblock: ", userId)
    const userExists = await dbUserRepository.getUserById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    // Update user's password in the database
    const user = await dbUserRepository.unblockAccount(userId);

    return user;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to unblock user", 401);
  }
};

export const handleBlockPost = async (
  postId: string,
  dbPostRepository: ReturnType<PostDBInterface>
) => {
  try {
    // console.log("Post details in handle block: ", postId);

    const post = await dbPostRepository.blockPost(postId);

    return post;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to block post", 401);
  }
};

export const handleUnblockPost = async (
  postId: string,
  dbPostRepository: ReturnType<PostDBInterface>
) => {
  try {
    // console.log("Post details in handle unblock: ", postId);

    const post = await dbPostRepository.unblockPost(postId);

    return post;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to unblock post", 401);
  }
};

export const handleApprovePremium = async (
  userId: string,
  dbPostRepository: ReturnType<PostDBInterface>
) => {
  try {
    // console.log("premiumResult details in handleApprovePremium: ", userId);

    const premiumResult = await dbPostRepository.approvePremium(userId);

    return premiumResult;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to approve premium", 401);
  }
};

export const handleRejectPremium = async (
  userId: string,
  dbPostRepository: ReturnType<PostDBInterface>
) => {
  try {
    // console.log("premiumResult details in handleRejectPremium: ", userId);

    const premiumResult = await dbPostRepository.rejectPremium(userId);

    return premiumResult;
  } catch (err) {
    console.error("Error: ", err);
    throw new ErrorInApplication("Failed to reject premium", 401);
  }
};
