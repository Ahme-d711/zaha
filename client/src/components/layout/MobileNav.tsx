import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Shop", path: "/products" },
  { icon: ShoppingBag, label: "Cart", path: "/cart" },
  { icon: User, label: "Account", path: "/account" },
];

export function MobileNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/30 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <div className="relative">
                <tab.icon className={`h-5 w-5 transition-colors ${active ? "text-accent" : "text-muted-foreground"}`} />
                {tab.label === "Cart" && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-accent" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="mobile-tab"
                  className="absolute -top-px left-2 right-2 h-0.5 bg-accent rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
