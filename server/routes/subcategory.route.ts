import { Router } from "express";
import {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  toggleSubcategoryStatus,
  getSubcategoryBySlug,
  restoreSubcategory,
} from "../controllers/subcategory.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { uploadSubcategory } from "../utils/upload.js";

export const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Subcategory management
 */

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Subcategories]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories
 */
router.get("/", getAllSubcategories);

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Get subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory details
 */
router.get("/:id", getSubcategoryById);

/**
 * @swagger
 * /subcategories/slug/{slug}:
 *   get:
 *     summary: Get subcategory by slug
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory details
 */
router.get("/slug/:slug", getSubcategoryBySlug);

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create subcategory (Admin only)
 *     tags: [Subcategories]
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
 *               categoryId: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Subcategory created
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadSubcategory.single("image"),
  createSubcategory
);

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update subcategory (Admin only)
 *     tags: [Subcategories]
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
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Subcategory updated
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadSubcategory.single("image"),
  updateSubcategory
);

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete subcategory (Admin only)
 *     tags: [Subcategories]
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
 *         description: Subcategory deleted
 */
router.delete("/:id", authenticate, authorize("admin"), deleteSubcategory);

/**
 * @swagger
 * /subcategories/{id}/restore:
 *   patch:
 *     summary: Restore subcategory (Admin only)
 *     tags: [Subcategories]
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
 *         description: Subcategory restored
 */
router.patch(
  "/:id/restore",
  authenticate,
  authorize("admin"),
  restoreSubcategory
);

/**
 * @swagger
 * /subcategories/{id}/toggle-status:
 *   patch:
 *     summary: Toggle subcategory status (Admin only)
 *     tags: [Subcategories]
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
  toggleSubcategoryStatus
);
