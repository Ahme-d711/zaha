import { motion } from "framer-motion";
import { ProductCard } from "@/features/products/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/api/product.service";

export function FeaturedProducts() {
  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productService.getAll({ limit: 4, is_best_seller: true }),
  });

  const featured = productsResponse?.data?.products ?? [];

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

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-destructive">
          Failed to load featured products.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product as any} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
