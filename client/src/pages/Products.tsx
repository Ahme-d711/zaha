import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productService } from "@/api/product.service";
import { categoryService } from "@/api/category.service";
import { ProductCard } from "@/features/products/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Loader2, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/api";

const PAGE_SIZE = 12;

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

function parsePage(value: string | null): number {
  const n = parseInt(value ?? "1", 12);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") ?? "all";
  const sort = parseSort(searchParams.get("sort"));
  const page = parsePage(searchParams.get("page"));

  const setSelectedCategory = (id: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id === "all") next.delete("category");
        else next.set("category", id);
        next.delete("page");
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
        next.delete("page");
        return next;
      },
      { replace: true }
    );
  };

  const setPage = (nextPage: number) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (nextPage <= 1) next.delete("page");
        else next.set("page", String(nextPage));
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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

  // Fetch Products with filters + pagination
  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ["shop-products", selectedCategory, sort, page],
    queryFn: () =>
      productService.getAll({
        ...(selectedCategory !== "all" ? { categoryId: selectedCategory } : {}),
        sort: getSortString(sort),
        page,
        limit: PAGE_SIZE,
      }),
  });

  const products = productsResponse?.data?.products ?? [];
  const pagination = productsResponse?.data?.pagination as
    | {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext?: boolean;
        hasPrev?: boolean;
      }
    | undefined;

  const totalProducts = pagination?.total ?? 0;
  const totalPages = Math.max(1, pagination?.pages ?? 1);
  const safePage = Math.min(page, totalPages);
  const rangeStart = totalProducts === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = totalProducts === 0 ? 0 : Math.min(safePage * PAGE_SIZE, totalProducts);
  const canPrev = pagination?.hasPrev ?? safePage > 1;
  const canNext = pagination?.hasNext ?? safePage < totalPages;

  /** If URL page is past the last page (e.g. after filters shrink results), clamp in the address bar */
  useEffect(() => {
    if (isLoading || !pagination) return;
    const maxPage = Math.max(1, pagination.pages || 1);
    if (page > maxPage) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (maxPage <= 1) next.delete("page");
          else next.set("page", String(maxPage));
          return next;
        },
        { replace: true }
      );
    }
  }, [isLoading, pagination, page, setSearchParams]);

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
            {totalProducts === 0
              ? "No products"
              : `Showing ${rangeStart}–${rangeEnd} of ${totalProducts} product${totalProducts !== 1 ? "s" : ""}`}
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

        {!isLoading && !isError && totalProducts > 0 && totalPages > 1 && (
          <nav
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            aria-label="Product list pagination"
          >
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canPrev}
                onClick={() => setPage(safePage - 1)}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canNext}
                onClick={() => setPage(safePage + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground order-1 sm:order-2">
              Page <span className="font-medium text-foreground">{safePage}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </p>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Products;
