import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true, trim: true },
    note: { type: String, trim: true, default: "" },
    amount: { type: Number, required: true, min: 0 },
    transactionDate: { type: String, required: true },
  },
  { timestamps: true },
);

transactionSchema.index({ user: 1, transactionDate: -1, createdAt: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
