import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/features/cart/CartProvider";
import { ThemeToggle } from "../ThemeToggle";
import { useAuthStore } from "@/store/use-auth-store";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/products" },
  { label: "Categories", path: "/products?view=categories" },
];

export function Header() {
  const { user } = useAuthStore();
  const allLinks = user?.role === "admin" 
    ? [...navLinks, { label: "Dashboard", path: "/dashboard" }] 
    : navLinks;

  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
      >
        <div className="section-padding flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Zaha Logo" className="h-16 w-auto" />
            <span className="font-display text-2xl font-semibold tracking-tight text-accent">Zaha</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {allLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === link.path ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Search">
              <Search className="h-5 w-5 text-muted-foreground" />
            </button>
            <Link to="/profile" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Account">
              <User className="h-5 w-5 text-muted-foreground" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Cart">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-semibold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              className="p-2 rounded-full hover:bg-secondary transition-colors md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-border/30"
            >
              <nav className="section-padding py-4 flex flex-col gap-3">
                {allLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm font-medium py-2 transition-colors ${
                      location.pathname === link.path ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <div className="h-16" />
    </>
  );
}
