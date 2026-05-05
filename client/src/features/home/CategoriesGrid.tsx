import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/api/category.service";
import { resolveMediaUrl } from "@/lib/media-url";
import { Loader2 } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CategoriesGrid() {
  const { data: categoriesResponse, isLoading, isError } = useQuery({
    queryKey: ["home-categories"],
    queryFn: () => categoryService.getAll(),
  });

  const categories = categoriesResponse?.data?.categories.filter(c => c.isShow) ?? [];

  return (
    <section className="section-padding py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">Shop by Category</h2>
        <p className="text-muted-foreground">Find exactly what you're looking for</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-destructive">
          Failed to load categories. Please try again later.
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat._id} variants={item}>
              <Link
                to={`/products?category=${cat._id}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src={resolveMediaUrl(cat.image)}
                  alt={cat.nameEn}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-primary-foreground font-semibold text-lg">{cat.nameEn}</h3>
                  <p className="text-primary-foreground/70 text-sm">{cat.productsCount ?? 0} products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
