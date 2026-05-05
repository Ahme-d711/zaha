import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Package,
  Layers,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/use-auth-store";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useLogout } from "@/hooks/use-logout";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", path: "/dashboard/orders" },
  { icon: Package, label: "Products", path: "/dashboard/products" },
  { icon: Layers, label: "Categories", path: "/dashboard/categories" },
  { icon: Users, label: "Customers", path: "/dashboard/customers" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

const vendorMenuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/vendor" },
  { icon: ShoppingBag, label: "My Orders", path: "/vendor/orders" },
  { icon: Package, label: "My Products", path: "/vendor/products" },
];

export const Sidebar = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const menuItems = isAdmin ? adminMenuItems : vendorMenuItems;
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const logoutMutation = useLogout();

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col sticky top-0">
      <ConfirmDialog
        open={logoutConfirmOpen}
        onOpenChange={setLogoutConfirmOpen}
        title="Sign out?"
        description="You will need to sign in again to use your account."
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        variant="destructive"
        isLoading={logoutMutation.isPending}
        onConfirm={() => logoutMutation.mutate()}
      />
      <div className="p-6">
        <Link to="/" className="flex items-center gap-0">
        <img src="/logo.png" alt="Zaha Logo" className="h-16 w-auto" />
        <span className="font-display text-2xl font-semibold tracking-tight text-accent">Zaha</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-accent/10 text-accent shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-accent" : "group-hover:text-foreground")} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && (
                <motion.div layoutId="active-indicator">
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          type="button"
          disabled={logoutMutation.isPending}
          onClick={() => setLogoutConfirmOpen(true)}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
        >
          {logoutMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
