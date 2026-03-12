import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/features/cart/CartProvider";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="glass-card-hover rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
              {product.badge}
            </span>
          )}
          {/* Quick actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-md hover:bg-card transition-colors"
              aria-label="Wishlist"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Heart className="h-4 w-4 text-muted-foreground" />
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
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
