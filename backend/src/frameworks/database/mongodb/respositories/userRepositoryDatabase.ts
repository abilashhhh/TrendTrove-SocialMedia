import { PostDataInterface } from "../../../../types/postsInterface";
import { ProfileInterface } from "../../../../types/profileInterface";
import {
  GoogleUserInterface,
  UserInterface,
} from "../../../../types/userInterface";
import Post from "../models/postModel";
import PremiumAccount from "../models/premiumAccount";
import ReportPost from "../models/reportPostModel";

import User from "../models/userModel";

//////////////////////////////////////////////////////////

export const userRepositoryMongoDB = () => {
  //////////////////////////////////////////////////////////

  const addUser = async (user: UserInterface | GoogleUserInterface) => {
    try {
      // // console.log("Add user tried to run, data : ", user);

      const newUser = new User(user);
      return await newUser.save();
    } catch (error) {
      // console.log(error);
      throw new Error("Error adding user!");
    }
  };

  //////////////////////////////////////////////////////////

  const getUserByEmail = async (email: string) => {
    try {
      const user = await User.findOne({ email });
      // console.log("User from getUserByEmail : ", user)
      return user;
    } catch (error) {
      // console.log(error);
      throw new Error("Error getting user by email!");
    }
  };

  //////////////////////////////////////////////////////////

  const getUserById = async (userId: string) => {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      // console.log(error);
      throw new Error("Error getting user by userId!");
    }
  };

  //////////////////////////////////////////////////////////

  const getUserByUsername = async (username: string) => {
    try {
      // // console.log("repo ;", username);
      const user = await User.findOne({ username });
      return user;
    } catch (error) {
      // console.log(error);
      throw new Error("Error getting user by username!");
    }
  };

  //////////////////////////////////////////////////////////

  const logoutUser = async (userId: string) => {
    try {
      await User.updateOne(
        {
          _id: userId,
        },
        { $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 } }
      );
    } catch (error) {
      throw new Error("Error logging out user");
    }
  };

  //////////////////////////////////////////////////////////

  const addRefreshTokenAndExpiry = async (
    email: string,
    refreshToken: string
  ) => {
    try {
      console.log("addRefreshTokenAndExpiry  email: ", email);
      console.log("addRefreshTokenAndExpiry  refreshToken: ", refreshToken);

      const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
      const user = await User.findOneAndUpdate(
        { email },
        { refreshToken, refreshTokenExpiresAt },
        { new: true }
      );
      return user;
    } catch (error) {
      // console.log(error);
      throw new Error("Error updating user refresh token and expiry!");
    }
  };

  //////////////////////////////////////////////////////////
  const updateProfile = async (profileInfo: ProfileInterface) => {
    try {
      const user = await User.findByIdAndUpdate(profileInfo._id, profileInfo, {
        new: true,
      });
      updateFollowSchemaDps()
      return user;
    } catch (error) {
      // console.log(error);
      throw new Error("Error updating profile!");
    }
  };

  const updatePassword = async (_id: string, encryptedNewPassword: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { password: encryptedNewPassword },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating password!");
    }
  };

  const deleteAccount = async (_id: string) => {
    try {
      const user = await User.findByIdAndDelete(_id);

      return user;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating password!");
    }
  };

  const suspendAccount = async (_id: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { isSuspended: true },
        { new: true }
      );

      return user;
    } catch (error) {
      console.error("Error suspending account:", error);
      throw new Error("Error suspending account!");
    }
  };

  const blockAccount = async (_id: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { isBlocked: true },
        { new: true }
      );

      return user;
    } catch (error) {
      console.error("Error blocking account:", error);
      throw new Error("Error blocking account!");
    }
  };

  const unblockAccount = async (_id: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { isBlocked: false },
        { new: true }
      );

      return user;
    } catch (error) {
      console.error("Error unblocking account:", error);
      throw new Error("Error unblocking account!");
    }
  };

  const privateAccount = async (_id: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { isPrivate: true },
        { new: true }
      );

      return user;
    } catch (error) {
      console.error("Error setting private account:", error);
      throw new Error("Error setting private account!");
    }
  };

  const publicAccount = async (_id: string) => {
    try {
      const user = await User.findByIdAndUpdate(
        _id,
        { isPrivate: false },
        { new: true }
      );

      return user;
    } catch (error) {
      console.error("Error setting public account:", error);
      throw new Error("Error setting public account!");
    }
  };

  const getAllUsers = async (id: string) => {
    try {
      const users = await User.find(
        {
          _id: { $ne: id },
          isAdmin: { $ne: true },
          isBlocked: { $ne: true },
          isSuspended: { $ne: true },
        },
        "username dp email name bio isPrivate isPremium followers following requestedByMe requestsForMe createdAt posts blockedUsers coverPhoto"
      ).exec();
      // console.log(users);
      return users;
    } catch (error) {
      console.error("Error getting all users", error);
      throw new Error("Error getting all users");
    }
  };

  const getAllUsersForAdmin = async () => {
    try {
      const users = await User.find(
        {
          isAdmin: { $ne: true },
        },
        "username dp name email bio isPrivate   isSuspended isBlocked isGoogleSignedIn "
      ).exec();
      // console.log(users);
      return users;
    } catch (error) {
      console.error("Error getting all users", error);
      throw new Error("Error getting all users");
    }
  };

  const getAllReportsForAdmin = async () => {
    try {
      const reports = await ReportPost.find().exec();

      const detailedReports = await Promise.all(
        reports.map(async report => {
          try {
            const post = await Post.findById(report.postId).exec();
            if (post) {
              return {
                ...report.toObject(),
                postDetails: post,
              };
            } else {
              // If post doesn't exist, return null or handle it as needed
              return null;
            }
          } catch (error) {
            console.error("Error getting post details for report:", error);
            throw new Error("Error getting post details for report");
          }
        })
      );

      const validReports = detailedReports.filter(report => report !== null);

      return validReports;
    } catch (error) {
      console.error("Error getting all reports:", error);
      throw new Error("Error getting all reports");
    }
  };

  const getAllPremiumRequestsForAdmin = async () => {
    try {
      const premiumAccounts = await PremiumAccount.find().exec();

      return premiumAccounts;
    } catch (error) {
      console.error("Error getting all PremiumAccount:", error);
      throw new Error("Error getting all PremiumAccount");
    }
  };

  const changeIsAccountVerified = async (email: string) => {
    try {
      await User.updateOne(
        { email },
        {
          $set: {
            isAccountVerified: true,
          },
        }
      );
      return true;
    } catch (error) {
      // console.log(error);
      throw new Error("Error changing isAccountVerified field");
    }
  };

  const changeIsAccountUnverified = async (userId: string) => {
    try {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            isAccountVerified: false,
          },
        }
      );
      return true;
    } catch (error) {
      // console.log(error);
      throw new Error("Error changing isAccountVerified field");
    }
  };

  const followUser = async (currentUserId: string, targetUserId: string) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);

      if (!currentUser || !targetUser) {
        throw new Error("User not found");
      }

      if (targetUser.isPrivate) {
        if (
          !currentUser.requestedByMe.some(user =>
            user.userId.equals(targetUserId)
          )
        ) {
          currentUser.requestedByMe.push({
            userId: targetUserId,
            dp: targetUser.dp,
            username: targetUser.username,
          });
          targetUser.requestsForMe.push({
            userId: currentUserId,
            username: currentUser.username,
            dp: currentUser.dp,
          });
        }
      } else {
        if (
          !currentUser.following.some(user => user.userId.equals(targetUserId))
        ) {
          currentUser.following.push({
            userId: targetUserId,
            username: targetUser.username,
            dp: targetUser.dp,
          });
          targetUser.followers.push({
            userId: currentUserId,
            username: currentUser.username,
            dp: currentUser.dp,
          });
        }
      }

      await currentUser.save();
      await targetUser.save();

      return { message: "You are now following this user" };
    } catch (error) {
      console.error("Error in makeUserAFollower", error);
      throw new Error("Error in makeUserAFollower");
    }
  };

  const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);

      if (!currentUser || !targetUser) {
        throw new Error("User not found");
      }

      currentUser.following = currentUser.following.filter(
        user => !user.userId.equals(targetUserId)
      );
      targetUser.followers = targetUser.followers.filter(
        user => !user.userId.equals(currentUserId)
      );

      await currentUser.save();
      await targetUser.save();

      // console.log("Unfollow successful");
      return { message: "You have unfollowed this user" };
    } catch (error) {
      console.error("Error in unfollowUser", error);
      throw new Error("Error in unfollowing the user");
    }
  };

  const cancelSendFriendRequest = async (
    currentUserId: string,
    requesterUserId: string
  ) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const requesterUser = await User.findById(requesterUserId);

      if (!currentUser || !requesterUser) {
        throw new Error("User not found");
      }

      currentUser.requestsForMe = currentUser.requestsForMe.filter(
        user => !user.userId.equals(requesterUserId)
      );
      requesterUser.requestedByMe = requesterUser.requestedByMe.filter(
        user => !user.userId.equals(currentUserId)
      );

      await currentUser.save();
      await requesterUser.save();

      // console.log("Unfollow successful");
      return { message: "You have cancelled the friend request sent" };
    } catch (error) {
      console.error("Error in cancelSendFriendRequest", error);
      throw new Error("Error in cancelling the send friend request");
    }
  };

  const acceptFriendRequest = async (
    currentUserId: string,
    requesterUserId: string
  ) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const requesterUser = await User.findById(requesterUserId);

      if (!currentUser || !requesterUser) {
        throw new Error("User not found");
      }

      currentUser.requestsForMe = currentUser.requestsForMe.filter(
        user => !user.userId.equals(requesterUserId)
      );
      requesterUser.requestedByMe = requesterUser.requestedByMe.filter(
        user => !user.userId.equals(currentUserId)
      );

      currentUser.followers.push({
        userId: requesterUserId,
        username: requesterUser.username,
        dp: requesterUser.dp,
      });
      requesterUser.following.push({
        userId: currentUserId,
        username: currentUser.username,
        dp: currentUser.dp,
      });

      await currentUser.save();
      await requesterUser.save();

      // console.log("Follow request accepted");
      return { message: "Follow request accepted" };
    } catch (error) {
      console.error("Error in acceptFriendRequest", error);
      throw new Error("Error in accepting the friend request");
    }
  };

  const rejectFriendRequest = async (
    currentUserId: string,
    requesterUserId: string
  ) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const requesterUser = await User.findById(requesterUserId);

      if (!currentUser || !requesterUser) {
        throw new Error("User not found");
      }

      currentUser.requestsForMe = currentUser.requestsForMe.filter(
        user => !user.userId.equals(requesterUserId)
      );

      requesterUser.requestedByMe = requesterUser.requestedByMe.filter(
        user => !user.userId.equals(currentUserId)
      );

      await currentUser.save();
      await requesterUser.save();

      // console.log("Follow request rejected");
      return { message: "Follow request rejected" };
    } catch (error) {
      console.error("Error in rejectFriendRequest", error);
      throw new Error("Error in rejecting the friend request");
    }
  };

  const setPaymentDetails = async (userId: string, paymentId: string) => {
    try {
      const currentUser = await User.findById(userId);

      if (!currentUser) {
        throw new Error("User not found");
      }

      let premiumAccount = await PremiumAccount.findOne({ userId });

      if (!premiumAccount) {
        premiumAccount = new PremiumAccount({
          userId,
          paymentDetails: paymentId,
          premiumRequest: {
            isRequested: true,
            documents: [],
          },
        });
      } else {
        premiumAccount.paymentDetails = paymentId;
      }

      await premiumAccount.save();
      return {
        status: "success",
        message: "Payment details updated successfully",
      };
    } catch (error) {
      console.error("Error in setPaymentDetails", error);

      throw new Error("Error in updating payment details");
    }
  };

  const handleDocumentSubmission = async (
    userId: string,
    documentType: string,
    images: string[]
  ) => {
    try {
      const premiumAccount = await PremiumAccount.findOne({ userId });

      if (!premiumAccount) {
        throw new Error("Premium account not found");
      }

      premiumAccount?.premiumRequest?.documents.push({
        type: documentType,
        image: images,
      });

      if (premiumAccount?.premiumRequest?.documents?.length > 0) {
        premiumAccount?.premiumRequest?.isRequested = true;
      }

      await premiumAccount.save();
      return { status: "success", message: "Documents submitted successfully" };
    } catch (error) {
      console.error("Error in handleDocumentSubmission", error);
      throw new Error("Error in submitting documents");
    }
  };

  const premiumUsersProgress = async (userId: string) => {
    try {
      const premiumAccount = await PremiumAccount.findOne({ userId });

      if (!premiumAccount) {
        throw new Error("Premium account not found");
      }

      return premiumAccount;
    } catch (error) {
      console.error("Error in handleDocumentSubmission", error);
      throw new Error("Error in submitting documents");
    }
  };

  const blockOtherUser = async (currentUserId: string, blockUserId: string) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const blockUser = await User.findById(blockUserId);

      if (!currentUser || !blockUser) {
        throw new Error("User not found");
      }

      if (currentUser.blockedUsers.includes(blockUserId)) {
        return { message: "User is already blocked" };
      }

      currentUser.blockedUsers.push(blockUserId);

      await currentUser.save();

      return { message: "You have blocked the user" };
    } catch (error) {
      console.error("Error in blockOtherUser", error);
      throw new Error("Error in blocking the user");
    }
  };

  const unblockOtherUser = async (
    currentUserId: string,
    unblockUserId: string
  ) => {
    try {
      const currentUser = await User.findById(currentUserId);
      const blockUser = await User.findById(unblockUserId);

      if (!currentUser || !blockUser) {
        throw new Error("User not found");
      }

      if (!currentUser.blockedUsers.includes(unblockUserId)) {
        return { message: "User is not blocked" };
      }

      currentUser.blockedUsers.pull(unblockUserId);

      await currentUser.save();

      return { message: "You have unblocked the user" };
    } catch (error) {
      console.error("Error in unblockOtherUser", error);
      throw new Error("Error in unblocking the user");
    }
  };

  const updateFollowSchemaDps = async () => {
    try {
      const users = await User.find({});

      for (const user of users) {
       
        const updateDpInArray = async (arrayName) => {
          for (const followEntry of user[arrayName]) {
            const followedUser = await User.findById(followEntry.userId, 'dp');
            if (followedUser) {
              followEntry.dp = followedUser.dp;
            }
          }
        };
  
        await updateDpInArray('requestsForMe');
        await updateDpInArray('requestedByMe');
        await updateDpInArray('followers');
        await updateDpInArray('following');
  
        await user.save();
      }
  
      console.log('Profile pictures updated successfully.');
    } catch (error) {
      console.error('Error updating profile pictures:', error);
    }
  };

  // updateFollowSchemaDps(); //
  
  const clearAll = async () => {
    try {
      const result = await User.updateMany(
        {},
        {
          $set: {
            requestsForMe: [],
            requestedByMe: [],
            followers: [],
            following: [],
          },
        }
      );

      // console.log(`Cleared data for  users.`);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  // clearAll();

  ////////////////////////////////////////////////

  return {
    addUser,
    getUserByEmail,
    getUserById,
    getUserByUsername,
    addRefreshTokenAndExpiry,
    logoutUser,
    updateProfile,
    updatePassword,
    changeIsAccountVerified,
    changeIsAccountUnverified,
    deleteAccount,
    suspendAccount,
    privateAccount,
    publicAccount,
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
    unblockOtherUser,
  };
};
//////////////////////////////////////////////////////////

export type UserRepositoryMongoDB = typeof userRepositoryMongoDB;
