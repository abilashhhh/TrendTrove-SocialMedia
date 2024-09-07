  import mongoose, { Schema, model } from "mongoose";

  const followSchema = new Schema(
    {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
      },
      username: { type: String },
      dp: { type: String },
      followedAt: { type: Date, default: Date.now },
    },
    { _id: false }
  );

  const userSchema = new Schema(
    {
      name: { type: String, required: true },
      username: { type: String },
      email: { type: String, required: true },
      address: { type: String },
      phone: { type: Number },
      password: { type: String, minlength: 6 },
      dp: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      },
      coverPhoto: {
        type: String,
        default:
          "http://res.cloudinary.com/ddiqmcmxy/image/upload/v1719983391/cover/pkgs68nko6bhagnzjvih.jpg",
      },
      bio: { type: String },
      gender: { type: String },
      isBlocked: { type: Boolean, default: false },
      isPrivate: { type: Boolean, default: false },
      isVerifiedAccount: { type: Boolean, default: false },
      isGoogleSignedIn: { type: Boolean, default: false },
      isPremium: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      isDarkMode: { type: Boolean, default: true },
      isLeftSidebarOpen: { type: Boolean, default: true },
      isRightSidebarOpen: { type: Boolean, default: true },
      role: { type: String, enum: ["admin", "user"], default: "user" },
      isSuspended: { type: Boolean, default: false },
      refreshToken: { type: String, default: null },
      refreshTokenExpiresAt: { type: Date, default: null },
      posts: [],
      requestsForMe: [followSchema],
      requestedByMe: [followSchema],
      followers: [followSchema],
      following: [followSchema],
      savedPosts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
      taggedPosts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
      notifications: [{ type: mongoose.Types.ObjectId, ref: "Message" }],
      blockedUsers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
  );

  const User = model("User", userSchema);

  export default User;
