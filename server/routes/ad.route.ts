import { Router } from "express";
import {
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  toggleAdStatus,
} from "../controllers/ad.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { uploadAd } from "../utils/upload.js";

export const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Advertisement management
 */

/**
 * @swagger
 * /ads:
 *   get:
 *     summary: Get all advertisements
 *     tags: [Ads]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of ads
 */
router.get("/", getAllAds);

/**
 * @swagger
 * /ads/{id}:
 *   get:
 *     summary: Get advertisement by ID
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad details
 */
router.get("/:id", getAdById);

/**
 * @swagger
 * /ads:
 *   post:
 *     summary: Create advertisement (Admin only)
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nameAr: { type: string }
 *               nameEn: { type: string }
 *               photo: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Ad created
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadAd.fields([
    { name: "photo", maxCount: 1 },
    { name: "mobilePhoto", maxCount: 1 },
  ]),
  createAd
);

/**
 * @swagger
 * /ads/{id}:
 *   put:
 *     summary: Update advertisement (Admin only)
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nameAr: { type: string }
 *               nameEn: { type: string }
 *               photo: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Ad updated
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadAd.fields([
    { name: "photo", maxCount: 1 },
    { name: "mobilePhoto", maxCount: 1 },
  ]),
  updateAd
);

/**
 * @swagger
 * /ads/{id}:
 *   delete:
 *     summary: Delete advertisement (Admin only)
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ad deleted
 */
router.delete("/:id", authenticate, authorize("admin"), deleteAd);

/**
 * @swagger
 * /ads/{id}/toggle-status:
 *   patch:
 *     summary: Toggle advertisement visibility (Admin only)
 *     tags: [Ads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch("/:id/toggle-status", authenticate, authorize("admin"), toggleAdStatus);
