import { Router } from "express";
import { getVendorStats, getVendorProducts, getVendorOrders } from "../controllers/vendor.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

// All vendor routes require authentication and vendor role
router.use(authenticate);
router.use(authorize("vendor", "admin", "super_admin")); // Admins can also see vendor-like views if needed

router.get("/stats", getVendorStats);
router.get("/products", getVendorProducts);
router.get("/orders", getVendorOrders);

export default router;
