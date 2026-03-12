import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { products, categories } from "@/constants/products";
import { ProductCard } from "@/features/products/ProductCard";
import { SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    let result = selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory);
    switch (sort) {
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "rating": return [...result].sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [selectedCategory, sort]);

  return (
    <div className="min-h-screen py-8">
      <div className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Shop All</h1>
          <p className="text-muted-foreground mb-8">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2 mr-4">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          </div>
          {[{ id: "all", name: "All" }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
          <div className="ml-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-lg bg-secondary text-sm border-none outline-none cursor-pointer text-foreground"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
