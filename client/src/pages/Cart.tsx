import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { Button } from "@/components/ui/button";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="section-padding">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-display font-bold mb-8"
        >
          Shopping Cart <span className="text-muted-foreground text-xl font-normal">({totalItems} items)</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl p-4 flex gap-4"
                >
                  <Link to={`/products/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product.id}`}>
                      <h3 className="font-medium text-sm sm:text-base mb-1 hover:text-accent transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground capitalize mb-3">{item.product.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 glass-card rounded-lg">
                        <button
                          onClick={() => void updateQuantity(item.product.id, item.quantity - 1, item.size)}
                          className="p-1.5 hover:text-accent transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => void updateQuantity(item.product.id, item.quantity + 1, item.size)}
                          className="p-1.5 hover:text-accent transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => void removeItem(item.product.id, item.size)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 h-fit sticky top-24"
          >
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent font-medium">Free</span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl text-base font-medium" size="lg">
              <Link to="/checkout">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link to="/products" className="block text-center text-sm text-muted-foreground hover:text-accent mt-4 transition-colors">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
