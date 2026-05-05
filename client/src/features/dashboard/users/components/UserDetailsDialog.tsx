import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  user?: {
    name?: string;
    email?: string;
  };
}

export const UserDetailsDialog = ({ open, onOpenChange, isLoading, user }: UserDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>User Details</DialogTitle>
        <DialogDescription>Detailed user information from backend.</DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
      ) : (
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Name:</span> {user?.name}</p>
          <p><span className="font-semibold">Email:</span> {user?.email}</p>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
