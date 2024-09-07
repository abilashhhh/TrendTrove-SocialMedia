import mongoose, { Schema, model } from "mongoose";

const documentSchema = new Schema({
  type: { type: String   },
  image: { type: [String]  },
});

const premiumAccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },
    paymentDetails: { type: String },
    hasExpired: { type: Boolean, default: false },
    premiumRequest: {
      isRequested: { type: Boolean, default: false },
      isAdminApproved: { type: Boolean, default: false },
      documents: [documentSchema],
    },
  },
  {
    timestamps: true,
  }
);

const PremiumAccount = model("PremiumAccount", premiumAccountSchema);

export default PremiumAccount;
  