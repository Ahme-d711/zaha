import { Router } from "express";
import { router as authRouter } from "./auth.route.js";
import { router as userRouter } from "./user.route.js";
import { router as categoryRouter } from "./category.route.js";
import { router as subcategoryRouter } from "./subcategory.route.js";
import { router as brandRouter } from "./brand.route.js";
import { router as sectionRouter } from "./section.route.js";
import { router as productRouter } from "./product.route.js";
import { orderRouter } from "./order.route.js";
import { router as adRouter } from "./ad.route.js";
import { router as authRoutes } from "./auth.route.js";
import { router as userRoutes } from "./user.route.js";
import { router as categoryRoutes } from "./category.route.js";
import { router as subcategoryRoutes } from "./subcategory.route.js";
import { router as brandRoutes } from "./brand.route.js";
import { router as sectionRoutes } from "./section.route.js";
import { router as productRoutes } from "./product.route.js";
import { orderRouter as orderRoutes } from "./order.route.js";
import { router as adRoutes } from "./ad.route.js";
import dashboardRoutes from "./dashboard.route.js";
import cartRouter from "./cart.route.js";
import wishlistRouter from "./wishlist.route.js";
import reviewRouter from "./review.route.js";
import transactionRouter from "./transaction.route.js";

import settingsRoutes from "./settings.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/subcategories", subcategoryRoutes);
router.use("/brands", brandRoutes);
router.use("/sections", sectionRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/ads", adRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/settings", settingsRoutes);
router.use("/cart", cartRouter);
router.use("/wishlist", wishlistRouter);
router.use("/reviews", reviewRouter);
router.use("/transactions", transactionRouter);

export { router };
