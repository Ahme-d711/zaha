import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  category?: {
    name?: string;
    description?: string;
    nameEn?: string;
    nameAr?: string;
  };
}

export const CategoryDetailsDialog = ({
  open,
  onOpenChange,
  isLoading,
  category,
}: CategoryDetailsDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Category Details</DialogTitle>
        <DialogDescription>View category details from backend.</DialogDescription>
      </DialogHeader>
      {isLoading ? (
        <div className="py-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-accent" /></div>
      ) : (
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Name:</span> {category?.name ?? category?.nameEn}</p>
          <p><span className="font-semibold">Description:</span> {category?.description ?? "-"}</p>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
