import mongoose from "mongoose";

const checklistProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    completedIds: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const ChecklistProgress = mongoose.model("ChecklistProgress", checklistProgressSchema);
