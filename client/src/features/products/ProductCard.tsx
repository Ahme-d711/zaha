import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Heart, Loader } from "lucide-react";
import { Product } from "@/types/api";
import { useCart } from "@/features/cart/CartProvider";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/media-url";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/api/wishlist.service";
import { useAuthStore } from "@/store/use-auth-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: wishlistResponse } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.get(),
    enabled: !!user,
  });

  const isInWishlist = wishlistResponse?.data?.wishlist?.products?.some(
    (p: any) => (typeof p === 'string' ? p : p._id) === product._id
  );

  const toggleWishlistMutation = useMutation({
    mutationFn: () => wishlistService.toggle(product._id),
    onSuccess: (response) => {
      queryClient.setQueryData(["wishlist"], response);
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update wishlist");
    },
  });

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    toggleWishlistMutation.mutate();
  };

  // Handle both old and new data structures for resilience
  const productId = product._id || product.id;
  const productName = product.nameEn || product.name;
  const productImage = product.images?.main ? resolveMediaUrl(product.images.main) : (product as any).image;
  const productPrice = product.price;
  const productOldPrice = product.old_price || (product as any).originalPrice;
  const productRating = product.rating || 0;
  const productReviews = product.reviews_count || (product as any).reviews || 0;
  const productCategory = typeof product.categoryId === 'object' ? product.categoryId.nameEn : (product as any).category;
  const productBadge = product.is_best_seller ? "Bestseller" : (product as any).badge;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product as any);
    toast.success(`${productName} added to cart`);
  };

  return (
    <Link to={`/products/${productId}`} className="group block">
      <div className="glass-card-hover rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badge */}
          {productBadge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
              {productBadge}
            </span>
          )}
          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full backdrop-blur-sm shadow-md transition-colors ${isInWishlist ? "bg-accent text-accent-foreground" : "bg-card/80 hover:bg-card"}`}
              aria-label="Wishlist"
              onClick={handleToggleWishlist}
              disabled={toggleWishlistMutation.isPending}
            >
              {toggleWishlistMutation.isPending ? (
                <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Heart className={`h-4 w-4 ${isInWishlist ? "fill-accent-foreground" : "text-muted-foreground"}`} />
              )}
            </motion.button>
          </div>
          {/* Add to cart */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{productCategory}</p>
          <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors flex-1">
            {productName}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-accent text-accent" />
            <span className="text-xs font-bold">{productRating}</span>
            <span className="text-[10px] text-muted-foreground">({productReviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">${productPrice.toLocaleString()}</span>
            {productOldPrice && (
              <span className="text-xs text-muted-foreground line-through">${productOldPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
