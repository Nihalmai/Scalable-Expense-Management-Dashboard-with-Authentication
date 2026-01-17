import express from "express";
import Expense from "../models/expense.js";

const router = express.Router();

/* ======================
   CREATE EXPENSE
====================== */
router.post("/", async (req, res) => {
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
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE EXPENSE
router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// UPDATE EXPENSE
router.put("/:id", async (req, res) => {
  try {
    const { title, amount, paidBy, splitBetween } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        paidBy,
        splitBetween,
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ======================
   GET ALL EXPENSES
====================== */
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find()
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
