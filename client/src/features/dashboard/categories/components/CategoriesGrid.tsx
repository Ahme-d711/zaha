import { CategoryListItem } from "@/api/dashboard-management.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resolveMediaUrl } from "@/lib/media-url";
import { ChevronRight, Edit, Loader2, Search, Trash2 } from "lucide-react";

interface CategoriesGridProps {
  categories: CategoryListItem[];
  search: string;
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export const CategoriesGrid = ({
  categories,
  search,
  isLoading,
  isError,
  onSearchChange,
  onView,
  onEdit,
}: CategoriesGridProps) => (
  <>
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search categories..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-muted/50 border-none"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></CardContent>
        </Card>
      )}
      {isError && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-10 text-sm text-destructive">Failed to load categories.</CardContent>
        </Card>
      )}
      {categories.map((category) => (
        <Card key={category._id} className="glass-card border-border/50 group hover:border-accent/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <img src={resolveMediaUrl(category.image)} alt={(category as { name?: string; nameEn?: string }).name ?? category.nameEn} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" />
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent" onClick={() => onEdit(category._id)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold font-playfair">{(category as { name?: string; nameEn?: string }).name ?? category.nameEn}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {(category as { description?: string; descriptionEn?: string }).description ?? category.descriptionEn ?? "-"}
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Products</p>
                  <p className="text-lg font-bold">{category.productsCount ?? 0}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sub-cats</p>
                  <p className="text-lg font-bold">{category.subcategoriesCount ?? 0}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted group-hover:bg-accent group-hover:text-white transition-colors" onClick={() => onView(category._id)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);
