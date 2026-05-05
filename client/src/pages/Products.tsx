import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productService } from "@/api/product.service";
import { categoryService } from "@/api/category.service";
import { ProductCard } from "@/features/products/ProductCard";
import { SlidersHorizontal, Loader2, ChevronDown } from "lucide-react";
import type { Product } from "@/types/api";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

const SORT_OPTIONS: SortOption[] = ["featured", "price-asc", "price-desc", "rating"];

function parseSort(value: string | null): SortOption {
  if (value && SORT_OPTIONS.includes(value as SortOption)) return value as SortOption;
  return "featured";
}

/** API returns `name`; dashboard types use `nameEn` — support both */
function categoryDisplayName(cat: { name?: string; nameEn?: string }) {
  const label = (cat.nameEn ?? cat.name ?? "").trim();
  return label || "Category";
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "all";
  const sort = parseSort(searchParams.get("sort"));

  const setSelectedCategory = (id: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id === "all") next.delete("category");
        else next.set("category", id);
        return next;
      },
      { replace: true }
    );
  };

  const setSort = (nextSort: SortOption) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (nextSort === "featured") next.delete("sort");
        else next.set("sort", nextSort);
        return next;
      },
      { replace: true }
    );
  };

  // Fetch Categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });

  const categories = useMemo(
    () => categoriesResponse?.data?.categories.filter((c) => c.isShow !== false) ?? [],
    [categoriesResponse?.data?.categories]
  );

  // Map sort options to backend (Mongoose) sort strings — must match `Product` schema fields
  const getSortString = (option: SortOption) => {
    switch (option) {
      case "price-asc":
        return "price";
      case "price-desc":
        return "-price";
      case "rating":
        return "-rating";
      case "featured":
      default:
        return "-is_best_seller -createdAt";
    }
  };

  // Fetch Products with filters
  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ["shop-products", selectedCategory, sort],
    queryFn: () =>
      productService.getAll({
        ...(selectedCategory !== "all" ? { categoryId: selectedCategory } : {}),
        sort: getSortString(sort),
        limit: 100,
      }),
  });

  const products = productsResponse?.data?.products ?? [];

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
            {products.length} product{products.length !== 1 ? "s" : ""}
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
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              type="button"
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat._id
                  ? "bg-accent text-accent-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {categoryDisplayName(cat)}
            </button>
          ))}
          <div className="w-full sm:w-auto sm:ml-auto flex justify-end">
            <div className="relative">
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-9 py-1.5 rounded-full bg-secondary text-sm border border-border/50 outline-none cursor-pointer text-foreground hover:bg-secondary/80 min-w-[10.5rem]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Products grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-accent animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-destructive">
            Failed to load products. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
