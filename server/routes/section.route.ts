import { Router } from "express";
import {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  toggleSectionStatus,
  getSectionBySlug,
  restoreSection,
} from "../controllers/section.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { uploadSection } from "../utils/upload.js";

export const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Website section management
 */

/**
 * @swagger
 * /sections:
 *   get:
 *     summary: Get all sections
 *     tags: [Sections]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sections
 */
router.get("/", getAllSections);

/**
 * @swagger
 * /sections/{id}:
 *   get:
 *     summary: Get section by ID
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section details
 */
router.get("/:id", getSectionById);

/**
 * @swagger
 * /sections/slug/{slug}:
 *   get:
 *     summary: Get section by slug
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Section details
 */
router.get("/slug/:slug", getSectionBySlug);

/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Create section (Admin only)
 *     tags: [Sections]
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
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Section created
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadSection.single("image"),
  createSection
);

/**
 * @swagger
 * /sections/{id}:
 *   put:
 *     summary: Update section (Admin only)
 *     tags: [Sections]
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
 *         description: Section updated
 */
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadSection.single("image"),
  updateSection
);

/**
 * @swagger
 * /sections/{id}:
 *   delete:
 *     summary: Delete section (Admin only)
 *     tags: [Sections]
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
 *         description: Section deleted
 */
router.delete("/:id", authenticate, authorize("admin"), deleteSection);

/**
 * @swagger
 * /sections/{id}/restore:
 *   patch:
 *     summary: Restore section (Admin only)
 *     tags: [Sections]
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
 *         description: Section restored
 */
router.patch(
  "/:id/restore",
  authenticate,
  authorize("admin"),
  restoreSection
);

/**
 * @swagger
 * /sections/{id}/toggle-status:
 *   patch:
 *     summary: Toggle section visibility (Admin only)
 *     tags: [Sections]
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
  toggleSectionStatus
);
