import mongoose from "mongoose";
import { ReviewModel } from "./server/models/review.model.js";
import { ProductModel } from "./server/models/product.model.js";
import dotenv from "dotenv";

dotenv.config();

const syncRatings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
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
