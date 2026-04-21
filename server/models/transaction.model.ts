import { Schema, model } from "mongoose";
import { ITransaction } from "../types/transaction.type.js";
import { UserModel } from "./user.model.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - userId
 *         - amount
 *         - type
 *       properties:
 *         id: { type: string }
 *         userId: { type: string }
 *         amount: { type: number }
 *         type: { type: string, enum: [TOPUP, PURCHASE, REFUND, BONUS] }
 *         status: { type: string, enum: [PENDING, COMPLETED, FAILED] }
 *         description: { type: string }
 *         referenceId: { type: string }
 *         createdAt: { type: string, format: date-time }
 */

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["TOPUP", "PURCHASE", "REFUND", "BONUS"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    referenceId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ userId: 1, createdAt: -1 });

// Middleware to update User totalBalance after a transaction is saved
TransactionSchema.post("save", async function (doc) {
  if (doc.status === "COMPLETED") {
    // If it's a purchase, amount should be recorded as positive in DB but subtract from user
    // Or we record as negative in DB for deduction. 
    // Let's decide: amount in Transaction is absolute, logic here decides add/subtract?
    // Better: record as negative in DB if deduction.
    
    await UserModel.findByIdAndUpdate(doc.userId, {
      $inc: { totalBalance: doc.amount }
    });
  }
});

export const TransactionModel = model<ITransaction>("transactions", TransactionSchema);
