import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    // Name of the person who paid
    paidBy: {
      type: String,
      required: true,
      trim: true,
    },

    // Names of people among whom expense is split
    splitBetween: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
