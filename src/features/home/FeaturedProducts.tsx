import { motion } from "framer-motion";
import { products } from "@/constants/products";
import { ProductCard } from "@/features/products/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section className="section-padding py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground">Hand-picked for you</p>
        </div>
        <Link
          to="/products"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
