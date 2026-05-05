import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  product?: {
    nameEn?: string;
    nameAr?: string;
    price?: number;
    stock?: number;
    isShow?: boolean;
  };
}

export const ProductDetailsDialog = ({
  open,
  onOpenChange,
  isLoading,
  product,
}: ProductDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>View full product info from backend.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Name:</span> {product?.nameEn}</p>
            <p><span className="font-semibold">Arabic Name:</span> {product?.nameAr}</p>
            <p><span className="font-semibold">Price:</span> ${product?.price}</p>
            <p><span className="font-semibold">Stock:</span> {product?.stock}</p>
            <p><span className="font-semibold">Status:</span> {product?.isShow ? "Active" : "Hidden"}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
