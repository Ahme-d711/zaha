import { Request, Response } from "express";
import { TransactionModel } from "../models/transaction.model.js";
import { topupSchema, queryTransactionSchema } from "../schemas/transaction.schema.js";
import AppError from "../errors/AppError.js";
import { UserModel } from "../models/user.model.js";

/**
 * Get current user's transaction history
 */
export const getMyTransactions = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const validatedQuery = queryTransactionSchema.parse(req.query);
  const { page, limit } = validatedQuery;

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    TransactionModel.countDocuments({ userId }),
  ]);

  res.status(200).json({
    success: true,
    message: "Transaction history fetched successfully",
    data: {
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  });
};

/**
 * Top up user balance (Simulation/Admin)
 */
export const topupBalance = async (req: Request, res: Response) => {
  const userId = req.user?._id; // In reality, this might be for a different user if called by Admin
  const { amount, description } = topupSchema.parse(req.body);

  const transaction = await TransactionModel.create({
    userId,
    amount,
    type: "TOPUP",
    status: "COMPLETED",
    description: description || "Balance recharge",
  });

  // User balance is updated via Mongoose middleware in TransactionModel

  res.status(201).json({
    success: true,
    message: "Balance topped up successfully",
    data: { transaction },
  });
};
