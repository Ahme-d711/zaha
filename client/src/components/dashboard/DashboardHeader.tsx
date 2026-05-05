import React, { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/store/use-auth-store";
import { resolveMediaUrl } from "@/lib/media-url";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const logoutMutation = useLogout();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "AE";

  return (
    <>
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
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input 
            placeholder="Search analytics, orders, customers..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-accent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </Button>
        
        <div className="w-px h-8 bg-border mx-2"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 hover:bg-muted rounded-full">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-none">{user?.name || "Ahmed Elgedawy"}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{user?.role || "Administrator"}</p>
                </div>
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={resolveMediaUrl(user?.picture)} />
                  <AvatarFallback className="bg-accent text-white">{initials}</AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/dashboard/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/dashboard/settings?tab=payments")}>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setLogoutConfirmOpen(true)}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    </>
  );
};
