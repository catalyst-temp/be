import express from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.js";
import { Transaction } from "../models/Transaction.js";
import { serializeTransaction } from "../utils/serializers.js";

export const transactionsRouter = express.Router();

transactionsRouter.use(requireAuth);

transactionsRouter.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      transactionDate: -1,
      createdAt: -1,
    });
    res.json({ transactions: transactions.map(serializeTransaction) });
  } catch (error) {
    next(error);
  }
});

transactionsRouter.post("/", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    const transactionDate = req.body.transactionDate || new Date().toISOString().slice(0, 10);
    const payload = {
      user: req.user.id,
      type: req.body.type,
      category: req.body.category,
      note: req.body.note || req.body.category,
      amount,
      transactionDate,
    };

    if (!["income", "expense"].includes(payload.type)) {
      return res.status(400).json({ message: "type must be income or expense" });
    }

    if (!payload.category || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "category and positive amount are required" });
    }

    const transaction = await Transaction.create(payload);
    return res.status(201).json({ transaction: serializeTransaction(transaction) });
  } catch (error) {
    return next(error);
  }
});

transactionsRouter.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});
