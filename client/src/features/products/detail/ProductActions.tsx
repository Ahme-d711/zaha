import { useState } from "react";
import { ShoppingBag, Heart, Truck, Shield, RotateCcw, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/types/api";
import { useCart } from "@/features/cart/CartProvider";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/api/wishlist.service";
import { useAuthStore } from "@/store/use-auth-store";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
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

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    toggleWishlistMutation.mutate();
  };

  const handleAddToCart = async () => {
    await addItem(product as any, quantity);
    toast.success(`${quantity}x ${product.nameEn || product.name} added to cart`);
  };

  const features = [
    { 
      icon: Truck, 
      label: product.shipping?.free_shipping ? "Free Shipping" : "Fast Shipping", 
      sub: product.shipping?.condition || "Delivery in 2-3 days" 
    },
    { icon: Shield, label: product.warranty || "1 Year Warranty", sub: "Full coverage" },
    { icon: RotateCcw, label: product.returns || "30 Days Returns", sub: "Easy returns" },
  ];

  return (
    <div className="space-y-8">
      {/* Quantity & Add to cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center glass-card rounded-xl">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-lg font-medium hover:text-accent transition-colors"
          >
            −
          </button>
          <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-3 text-lg font-medium hover:text-accent transition-colors"
          >
            +
          </button>
        </div>
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl text-base font-medium"
        >
          <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
        <Button
          onClick={handleToggleWishlist}
          variant="outline"
          size="lg"
          className={`rounded-xl border-border/50 ${isInWishlist ? "text-accent border-accent/30 bg-accent/5" : ""}`}
          aria-label="Wishlist"
          disabled={toggleWishlistMutation.isPending}
        >
          {toggleWishlistMutation.isPending ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={`h-5 w-5 ${isInWishlist ? "fill-accent" : ""}`} />
          )}
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4">
        {features.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="glass-card rounded-xl p-3 text-center">
            <Icon className="h-5 w-5 mx-auto mb-1.5 text-accent" />
            <p className="text-xs font-medium">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
