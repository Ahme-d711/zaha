import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Package, CreditCard, MapPin } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: Package },
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const { items, totalPrice, clearCart } = useCart();

  const handleComplete = () => {
    setCompleted(true);
    clearCart();
  };

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-accent" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order is on its way.</p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="section-padding max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold mb-8"
        >
          Checkout
        </motion.h1>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <motion.div
                animate={{
                  backgroundColor: currentStep >= step.id ? "hsl(38, 92%, 50%)" : "hsl(var(--secondary))",
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5 text-accent-foreground" />
                ) : (
                  <step.icon className={`h-5 w-5 ${currentStep >= step.id ? "text-accent-foreground" : "text-muted-foreground"}`} />
                )}
              </motion.div>
              <span className={`ml-2 text-sm font-medium hidden sm:block ${currentStep >= step.id ? "" : "text-muted-foreground"}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="h-px bg-border relative">
                    <motion.div
                      animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                      className="absolute inset-y-0 left-0 bg-accent"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-6 sm:p-8"
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="rounded-xl bg-secondary/50 border-border/30" />
                  <Input placeholder="Last Name" className="rounded-xl bg-secondary/50 border-border/30" />
                </div>
                <Input placeholder="Address" className="rounded-xl bg-secondary/50 border-border/30" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input placeholder="City" className="rounded-xl bg-secondary/50 border-border/30" />
                  <Input placeholder="State" className="rounded-xl bg-secondary/50 border-border/30" />
                  <Input placeholder="ZIP" className="rounded-xl bg-secondary/50 border-border/30" />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <Input placeholder="Card Number" className="rounded-xl bg-secondary/50 border-border/30" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" className="rounded-xl bg-secondary/50 border-border/30" />
                  <Input placeholder="CVC" className="rounded-xl bg-secondary/50 border-border/30" />
                </div>
                <Input placeholder="Name on Card" className="rounded-xl bg-secondary/50 border-border/30" />
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Review</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border/50 pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="rounded-xl"
          >
            Back
          </Button>
          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
            >
              Place Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
