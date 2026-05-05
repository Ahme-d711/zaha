import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoriesHeaderProps {
  onAdd: () => void;
}

export const CategoriesHeader = ({ onAdd }: CategoriesHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold font-playfair tracking-tight">Categories</h1>
      <p className="text-muted-foreground mt-1">Organize your products with categories and subcategories.</p>
    </div>
    <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={onAdd}>
      <Plus className="w-4 h-4 mr-2" />
      New Category
    </Button>
  </div>
);
