"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const documentSchema = new mongoose_1.Schema({
    type: { type: String },
    image: { type: [String] },
});
const premiumAccountSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    isPremium: { type: Boolean, default: false },
    premiumExpiresAt: { type: Date },
    paymentDetails: { type: String },
    hasExpired: { type: Boolean, default: false },
    premiumRequest: {
        isRequested: { type: Boolean, default: false },
        isAdminApproved: { type: Boolean, default: false },
        documents: [documentSchema],
    },
}, {
    timestamps: true,
});
const PremiumAccount = (0, mongoose_1.model)("PremiumAccount", premiumAccountSchema);
exports.default = PremiumAccount;
