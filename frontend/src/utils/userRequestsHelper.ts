import { toast } from "react-toastify";
import { sendAcceptFollowRequest, sendCancelFollowRequest, sendFollowRequest, sendRejectFollowRequest, sendUnfollowRequest } from "../API/User/user";

export const followUser = async (
  currentUser: string,
  targetUserId: string, 
  targetUserUserName: string, 
) => {
  try {
    console.log("Follow user pressed for: ", targetUserId, targetUserUserName);

    const unfollowResult = await sendFollowRequest(currentUser, targetUserId);

    console.log("followResult: ", unfollowResult);

    if (unfollowResult.status === "success") {
      toast.success(`Successfully followed ${targetUserUserName}`);
      return true
    } else {
      toast.error(`Failed to follow ${targetUserUserName}: ${unfollowResult.message}`);
      return false
    }


  } catch (error) {
    console.error("Failed to follow user:", error);
    toast.error("Failed to follow user");
  }
};

export const unfollowUser = async (
    currentUser: string,
    targetUserId: string, 
    targetUserUserName: string, 
  ) => {
    try {
      console.log("unFollow user pressed for: ", targetUserId, targetUserUserName);
  
      const unfollowResult = await sendUnfollowRequest(currentUser, targetUserId);
  
      console.log("unfollowResult: ", unfollowResult);
  
      if (unfollowResult.status === "success") {
        toast.success(`Successfully unfollowed ${targetUserUserName}`);
        return true
      } else {
        toast.error(`Failed to unfollow ${targetUserUserName}: ${unfollowResult.message}`);
        return false
      }
  
  
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      toast.error("Failed to unfollow user");
    }
  };
  
 
export const cancelFollowRequest = async (
  currentUser: string,
  targetUserId: string,
  targetUserUserName: string,
) => {
  try {
    console.log("Follow user pressed for: ", targetUserId, targetUserUserName);
    console.log("Main user: ", currentUser, );
 

    const cancelResult = await sendCancelFollowRequest(
      currentUser,
      targetUserId
    );
    console.log("cancelResult: ", cancelResult);
    if (cancelResult.status === "success") {
      toast.success(`Successfully cancelled friend request for ${targetUserUserName}`);
      return true

    } else {
      toast.error(`Failed to cancel friend request for ${targetUserUserName}: ${cancelResult.message}`);
      return false
    }
  } catch (error) {
    toast.error("Failed to cancel follow request");
  }
};



export const acceptFollowRequests = async (
    currentUser: string,
    targetUserId: string,
    targetUserUserName: string,
  ) => {
    try {
      console.log("Follow user pressed for: ", targetUserId, targetUserUserName);
      console.log("Main user: ", currentUser, );
   
  
      const acceptResult = await sendAcceptFollowRequest(
        currentUser,
        targetUserId
      );
      console.log("acceptResult: ", acceptResult);
      if (acceptResult.status === "success") {
        toast.success(`Successfully accepted friend request for ${targetUserUserName}`);
        return true
  
      } else {
        toast.error(`Failed to accept friend request for ${targetUserUserName}: ${acceptResult.message}`);
        return false
      }
    } catch (error) {
      toast.error("Failed to accept friend request");
    }
  };
  

export const rejectFollowRequests = async (
    currentUser: string,
    targetUserId: string,
    targetUserUserName: string,
  ) => {
    try {
      console.log("Follow user pressed for: ", targetUserId, targetUserUserName);
      console.log("Main user: ", currentUser, );
   
  
      const rejectResult = await sendRejectFollowRequest(
        currentUser,
        targetUserId
      );
      console.log("rejectResult: ", rejectResult);
      if (rejectResult.status === "success") {
        toast.success(`Successfully rejected friend request for ${targetUserUserName}`);
        return true
  
      } else {
        toast.error(`Failed to reject friend request for ${targetUserUserName}: ${rejectResult.message}`);
        return false
      }
    } catch (error) {
      toast.error("Failed to reject friend request"); 
    }
  };
  