import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Package, CreditCard, MapPin } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { orderService, CheckoutPaymentMethod } from "@/api/order.service";
import { useAuthStore } from "@/store/use-auth-store";
import { resolveMediaUrl } from "@/lib/media-url";

const steps = [
  { id: 1, label: "Shipping", icon: MapPin },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: Package },
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    recipientPhone: user?.phone || "",
    shippingAddress: "",
    city: "",
    governorate: "",
    country: "Egypt",
    postalCode: "",
    customerNotes: "",
    paymentMethod: "COD" as CheckoutPaymentMethod,
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardholderName: "",
  });

  const canProceedToPayment = useMemo(() => {
    return Boolean(
      form.firstName.trim() &&
        form.lastName.trim() &&
        form.recipientPhone.trim() &&
        form.shippingAddress.trim() &&
        form.city.trim() &&
        form.governorate.trim() &&
        form.country.trim()
    );
  }, [form]);

  const isCardFieldsValid = useMemo(() => {
    const digits = form.cardNumber.replace(/\s/g, "");
    const expiry = form.cardExpiry.trim();
    const expiryOk = /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(expiry);
    const cvcOk = /^[0-9]{3,4}$/.test(form.cardCvc.trim());
    const nameOk = form.cardholderName.trim().length >= 3;
    return (
      digits.length >= 13 &&
      digits.length <= 19 &&
      /^\d+$/.test(digits) &&
      expiryOk &&
      cvcOk &&
      nameOk
    );
  }, [form.cardNumber, form.cardExpiry, form.cardCvc, form.cardholderName]);

  const handleContinue = () => {
    if (currentStep === 1 && !canProceedToPayment) {
      toast.error("Please complete all required shipping fields");
      return;
    }
    if (currentStep === 2 && form.paymentMethod === "CARD" && !isCardFieldsValid) {
      toast.error("Please enter valid card number, expiry (MM/YY), CVC, and name on card");
      return;
    }
    setCurrentStep((prev) => Math.min(3, prev + 1));
  };

  const handleComplete = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (form.paymentMethod === "CARD" && !isCardFieldsValid) {
      toast.error("Please enter complete card details before placing the order");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        recipientName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        recipientPhone: form.recipientPhone.trim(),
        shippingAddress: form.shippingAddress.trim(),
        city: form.city.trim(),
        governorate: form.governorate.trim(),
        country: form.country.trim(),
        postalCode: form.postalCode.trim() || undefined,
        customerNotes: form.customerNotes.trim() || undefined,
        paymentMethod: form.paymentMethod,
      };
      await orderService.checkout(payload);
      await clearCart();
      setCompleted(true);
      toast.success("Order placed successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Failed to place order";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
                  <Input
                    placeholder="First Name"
                    className="rounded-xl bg-secondary/50 border-border/30"
                    value={form.firstName}
                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="Last Name"
                    className="rounded-xl bg-secondary/50 border-border/30"
                    value={form.lastName}
                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Phone Number"
                  className="rounded-xl bg-secondary/50 border-border/30"
                  value={form.recipientPhone}
                  onChange={(e) => setForm((prev) => ({ ...prev, recipientPhone: e.target.value }))}
                />
                <Input
                  placeholder="Address"
                  className="rounded-xl bg-secondary/50 border-border/30"
                  value={form.shippingAddress}
                  onChange={(e) => setForm((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    className="rounded-xl bg-secondary/50 border-border/30"
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  />
                  <Input
                    placeholder="Governorate/State"
                    className="rounded-xl bg-secondary/50 border-border/30"
                    value={form.governorate}
                    onChange={(e) => setForm((prev) => ({ ...prev, governorate: e.target.value }))}
                  />
                  <Input
                    placeholder="ZIP"
                    className="rounded-xl bg-secondary/50 border-border/30"
                    value={form.postalCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Country"
                  className="rounded-xl bg-secondary/50 border-border/30"
                  value={form.country}
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                />
                <Textarea
                  placeholder="Order notes (optional)"
                  className="rounded-xl bg-secondary/50 border-border/30"
                  value={form.customerNotes}
                  onChange={(e) => setForm((prev) => ({ ...prev, customerNotes: e.target.value }))}
                />
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant={form.paymentMethod === "COD" ? "default" : "outline"}
                    onClick={() => setForm((prev) => ({ ...prev, paymentMethod: "COD" }))}
                    className="rounded-xl"
                  >
                    Cash On Delivery
                  </Button>
                  <Button
                    type="button"
                    variant={form.paymentMethod === "CARD" ? "default" : "outline"}
                    onClick={() => setForm((prev) => ({ ...prev, paymentMethod: "CARD" }))}
                    className="rounded-xl"
                  >
                    Card
                  </Button>
                  <Button
                    type="button"
                    variant={form.paymentMethod === "WALLET" ? "default" : "outline"}
                    onClick={() => setForm((prev) => ({ ...prev, paymentMethod: "WALLET" }))}
                    className="rounded-xl"
                  >
                    Wallet
                  </Button>
                </div>
                {form.paymentMethod === "CARD" && (
                  <div className="space-y-4 pt-2 border-t border-border/40">
                    <p className="text-sm font-medium text-foreground">Card details</p>
                    <div className="space-y-2">
                      <Label htmlFor="checkout-card-number">Card number</Label>
                      <Input
                        id="checkout-card-number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        className="rounded-xl bg-secondary/50 border-border/30"
                        value={form.cardNumber}
                        maxLength={23}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 19);
                          const groups = raw.match(/.{1,4}/g);
                          const spaced = groups ? groups.join(" ") : "";
                          setForm((prev) => ({ ...prev, cardNumber: spaced }));
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkout-card-expiry">Expiry</Label>
                        <Input
                          id="checkout-card-expiry"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          placeholder="MM / YY"
                          className="rounded-xl bg-secondary/50 border-border/30"
                          value={form.cardExpiry}
                          maxLength={9}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length >= 2) v = `${v.slice(0, 2)} / ${v.slice(2)}`;
                            setForm((prev) => ({ ...prev, cardExpiry: v }));
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkout-card-cvc">CVC</Label>
                        <Input
                          id="checkout-card-cvc"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          placeholder="123"
                          className="rounded-xl bg-secondary/50 border-border/30"
                          value={form.cardCvc}
                          maxLength={4}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkout-card-name">Name on card</Label>
                      <Input
                        id="checkout-card-name"
                        autoComplete="cc-name"
                        placeholder="Name as printed on card"
                        className="rounded-xl bg-secondary/50 border-border/30"
                        value={form.cardholderName}
                        onChange={(e) => setForm((prev) => ({ ...prev, cardholderName: e.target.value }))}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Card details are collected for checkout flow only. Connect a payment provider to charge securely;
                      they are not sent to our server in plain text.
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {form.paymentMethod === "WALLET"
                    ? "Wallet balance will be deducted immediately if sufficient."
                    : form.paymentMethod === "CARD"
                      ? "Enter your card details above, then continue to review your order."
                      : "Payment status will remain pending until payment is completed."}
                </p>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Review</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={resolveMediaUrl(item.product.images?.main || item.product.mainImage)}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
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
              onClick={handleContinue}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
