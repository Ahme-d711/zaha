import { Router } from "express";
import {
  getMyTransactions,
  topupBalance,
} from "../controllers/transaction.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wallet & Transactions
 *   description: User wallet balance and transaction history
 */

router.use(authenticate);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get current user's transaction history
 *     tags: [Wallet & Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get("/", getMyTransactions);

/**
 * @swagger
 * /transactions/topup:
 *   post:
 *     summary: Recharge user wallet balance (Simulation)
 *     tags: [Wallet & Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount: { type: number, minimum: 1 }
 *     responses:
 *       200:
 *         description: Balance updated successfully
 */
router.post("/topup", topupBalance);

export default router;
