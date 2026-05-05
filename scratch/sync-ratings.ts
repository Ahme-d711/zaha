import mongoose from "mongoose";
import { ReviewModel } from "../server/models/review.model.js";
import { ProductModel } from "../server/models/product.model.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

const syncRatings = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not found in .env");

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const products = await ProductModel.find({});
    console.log(`Found ${products.length} products`);

    for (const product of products) {
      await (ReviewModel as any).calculateAverageRating(product._id);
      console.log(`Synced rating for product: ${product.name}`);
    }

    console.log("Sync complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing ratings:", error);
    process.exit(1);
  }
};

syncRatings();
