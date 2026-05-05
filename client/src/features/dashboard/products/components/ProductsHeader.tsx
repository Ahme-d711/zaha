import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsHeaderProps {
  onAddClick: () => void;
}

export const ProductsHeader = ({ onAddClick }: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold font-playfair tracking-tight">Products Management</h1>
        <p className="text-muted-foreground mt-1">Manage your catalog, stock, and pricing.</p>
      </div>
      <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>
  );
};
