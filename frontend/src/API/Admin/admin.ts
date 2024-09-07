import axiosAdminInstance, {
  axiosAdminRefreshInstance,
} from "../Axios/axiosAdminInstance";
import END_POINTS from "../../Constants/endpoints";
import {
  ApprovePremiumResponse,
  BlockPostResponse,
  BlockUserResponse,
  GetPostReportsResponse,
  GetPremiumAccountResponse,
  GetUsersResponse,
  RemovePremiumResponse,
} from "../../Types/admin";
import axios, { AxiosError } from "axios";

const handleAxiosError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        "Server responded with status:",
        axiosError.response.status
      );
      console.error("Response data:", axiosError.response.data);
    } else if (axiosError.request) {
      console.error("No response received from the server");
    } else {
      console.error("Error setting up the request:", axiosError.message);
    }
  } else {
    console.error("An error occurred:", error.message);
  }
};

export const refreshAdminAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await axiosAdminRefreshInstance.get<{ accessToken: string }>(
    END_POINTS.REFRESH_ADMIN_TOKEN,
    { withCredentials: true }
  );
  return response.data;
};

export const logoutAdmin = async (): Promise<{
  status: string;
  message: string;
}> => {
  // console.log("Called admin logout : ");
  const response = await axiosAdminInstance.delete<{
    status: string;
    message: string;
  }>(END_POINTS.ADMIN_LOGOUT);
  // console.log("admin logout - response daa: ", response.data);
  return response.data;
};

export const getAllUsersForAdmin = async (): Promise<GetUsersResponse> => {
  try {
    // console.log("called getallusersadmin");
    const response = await axiosAdminInstance.get<GetUsersResponse>(
      END_POINTS.GET_USERS
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const fetchAllPremiumAccountData =
  async (): Promise<GetPremiumAccountResponse> => {
    try {
      console.log("called fetchAllPremiumAccountData");
      const response = await axiosAdminInstance.get<GetPremiumAccountResponse>(
        END_POINTS.GET_PREMIUM_ACCOUNTS
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

export const fetchAllPostReportsAndPosts =
  async (): Promise<GetPostReportsResponse> => {
    try {
      // console.log("called fetchAllPostReports");
      const response = await axiosAdminInstance.get<GetPostReportsResponse>(
        END_POINTS.GET_POST_REPORTS
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  };

export const blockUser = async (userId: string): Promise<BlockUserResponse> => {
  try {
    // console.log(userId, "from blockuser acc");

    const response = await axiosAdminInstance.patch<BlockUserResponse>(
      `${END_POINTS.BLOCK_USER.replace(":userId", userId)}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const unblockUser = async (
  userId: string
): Promise<BlockUserResponse> => {
  try {
    // console.log(userId, "from unblockuser acc");

    const response = await axiosAdminInstance.patch<BlockUserResponse>(
      `${END_POINTS.UNBLOCK_USER.replace(":userId", userId)}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const blockPost = async (postId: string): Promise<BlockPostResponse> => {
  try {
    // console.log(postId, "from blockPost");

    const response = await axiosAdminInstance.patch<BlockPostResponse>(
      `${END_POINTS.BLOCK_POST.replace(":postId", postId)}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const unblockPost = async (
  postId: string
): Promise<BlockPostResponse> => {
  try {
    // console.log(postId, "from unblockPost");

    const response = await axiosAdminInstance.patch<BlockPostResponse>(
      `${END_POINTS.UNBLOCK_POST.replace(":postId", postId)}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};


export const approvePremium = async (userId: string): Promise<ApprovePremiumResponse> => {
  try {
    console.log(userId, "from approvePremium");

    const response = await axiosAdminInstance.patch<ApprovePremiumResponse>(
      `${END_POINTS.APPROVE_PREMIUM.replace(":userId", userId)}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const removePremium = async (
  userId: string
): Promise<RemovePremiumResponse> => {
  try {
    console.log(userId, "from removePremium");

    const response = await axiosAdminInstance.patch<RemovePremiumResponse>(
      `${END_POINTS.REMOVE_PREMIUM.replace(":userId", userId)}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
