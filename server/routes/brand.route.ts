import { Router } from "express";
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
  getBrandBySlug,
  restoreBrand,
} from "../controllers/brand.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { uploadBrand } from "../utils/upload.js";

export const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 */
router.get("/", getAllBrands);

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand details
 */
router.get("/:id", getBrandById);

/**
 * @swagger
 * /brands/slug/{slug}:
 *   get:
 *     summary: Get brand by slug
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brand details
 */
router.get("/slug/:slug", getBrandBySlug);

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create brand (Admin only)
 *     tags: [Brands]
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
 *               logo: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Brand created
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadBrand.single("logo"),
  createBrand
);

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Update brand (Admin only)
 *     tags: [Brands]
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
 *               logo: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Brand updated
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadBrand.single("logo"),
  updateBrand
);

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Delete brand (Admin only)
 *     tags: [Brands]
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
 *         description: Brand deleted
 */
router.delete("/:id", authenticate, authorize("admin"), deleteBrand);

/**
 * @swagger
 * /brands/{id}/restore:
 *   patch:
 *     summary: Restore brand (Admin only)
 *     tags: [Brands]
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
 *         description: Brand restored
 */
router.patch(
  "/:id/restore",
  authenticate,
  authorize("admin"),
  restoreBrand
);

/**
 * @swagger
 * /brands/{id}/toggle-status:
 *   patch:
 *     summary: Toggle brand status (Admin only)
 *     tags: [Brands]
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
router.patch(
  "/:id/toggle-status",
  authenticate,
  authorize("admin"),
  toggleBrandStatus
);
