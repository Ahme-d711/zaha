import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/api/wishlist.service";
import { ProductCard } from "@/features/products/ProductCard";
import { Heart, Loader2, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Wishlist = () => {
  const queryClient = useQueryClient();

  const { data: wishlistResponse, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.get(),
  });

  const wishlist = wishlistResponse?.data?.wishlist;
  const products = (wishlist?.products || []) as any[];

  const clearWishlistMutation = useMutation({
    mutationFn: () => wishlistService.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Wishlist cleared");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Failed to load wishlist. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-display font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {products.length} item{products.length !== 1 ? "s" : ""} saved for later
            </p>
          </motion.div>

          {products.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={() => clearWishlistMutation.mutate()}
                disabled={clearWishlistMutation.isPending}
                className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5"
              >
                {clearWishlistMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Clear Wishlist
              </Button>
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 glass-card rounded-[32px] border-dashed"
            >
              <div className="h-20 w-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Save items you like to your wishlist so you can find them easily later.
              </p>
              <Button asChild size="lg" className="rounded-xl bg-accent text-accent-foreground px-8">
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Explore Products
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
