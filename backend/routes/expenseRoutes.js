import express from "express";
import Expense from "../models/expense.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ======================
   CREATE EXPENSE
====================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, paidBy, splitBetween } = req.body;

    if (!title || !amount || !paidBy || !splitBetween) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(splitBetween) || splitBetween.length === 0) {
      return res
        .status(400)
        .json({ message: "Split must include at least one user" });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: Number(amount),
      paidBy: paidBy.trim(),
      splitBetween,
      user: req.user.id, // 🔥 LINK EXPENSE TO USER
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   GET USER EXPENSES
====================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   UPDATE EXPENSE
====================== */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, amount, paidBy, splitBetween } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, amount, paidBy, splitBetween },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ======================
   DELETE EXPENSE
====================== */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
