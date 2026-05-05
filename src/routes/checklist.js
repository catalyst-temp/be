import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { ChecklistProgress } from "../models/ChecklistProgress.js";

export const checklistRouter = express.Router();

checklistRouter.use(requireAuth);

checklistRouter.get("/", async (req, res, next) => {
  try {
    const progress = await ChecklistProgress.findOne({ user: req.user.id });
    res.json({ completedIds: progress?.completedIds || [] });
  } catch (error) {
    next(error);
  }
});

checklistRouter.put("/", async (req, res, next) => {
  try {
    const completedIds = Array.isArray(req.body.completedIds)
      ? [...new Set(req.body.completedIds.filter((id) => typeof id === "string"))]
      : [];

    const progress = await ChecklistProgress.findOneAndUpdate(
      { user: req.user.id },
      { completedIds },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ completedIds: progress.completedIds });
  } catch (error) {
    next(error);
  }
});

checklistRouter.post("/toggle", async (req, res, next) => {
  try {
    const { itemId } = req.body;
    if (typeof itemId !== "string" || !itemId.trim()) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const current = await ChecklistProgress.findOne({ user: req.user.id });
    const currentIds = current?.completedIds || [];
    const completedIds = currentIds.includes(itemId)
      ? currentIds.filter((id) => id !== itemId)
      : [...currentIds, itemId];

    const progress = await ChecklistProgress.findOneAndUpdate(
      { user: req.user.id },
      { completedIds },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return res.json({ completedIds: progress.completedIds });
  } catch (error) {
    return next(error);
  }
});

checklistRouter.delete("/", async (req, res, next) => {
  try {
    const progress = await ChecklistProgress.findOneAndUpdate(
      { user: req.user.id },
      { completedIds: [] },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json({ completedIds: progress.completedIds });
  } catch (error) {
    next(error);
  }
});
