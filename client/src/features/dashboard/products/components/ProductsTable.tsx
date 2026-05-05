import { Eye, Edit, Loader2, MoreHorizontal, Search, Trash2, ChevronDown } from "lucide-react";
import { CategoryListItem, ProductListItem } from "@/api/dashboard-management.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resolveMediaUrl } from "@/lib/media-url";
import { Link } from "react-router-dom";
import type { DashboardProductFilterTab } from "./products.types";

interface ProductsTableProps {
  products: ProductListItem[];
  search: string;
  filterTab?: DashboardProductFilterTab;
  onFilterTabChange?: (tab: DashboardProductFilterTab) => void;
  categoryFilter?: string;
  onCategoryFilterChange?: (categoryId: string) => void;
  categories?: CategoryListItem[];
  /** When false, hides filter tabs + category select (e.g. vendor view) */
  showFilters?: boolean;
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
  getCategoryLabel?: (categoryId?: string | { _id?: string; name?: string; nameEn?: string }) => string;
}

export const ProductsTable = ({
  products,
  search,
  filterTab = "all",
  onFilterTabChange = () => {},
  categoryFilter = "",
  onCategoryFilterChange = () => {},
  categories = [],
  showFilters = true,
  isLoading,
  isError,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
  deletingId,
  getCategoryLabel = () => "-",
}: ProductsTableProps) => {
  return (
    <>
      {showFilters && (
      <Tabs
        value={filterTab}
        onValueChange={(v) => onFilterTabChange(v as DashboardProductFilterTab)}
        className="w-full"
      >
        <TabsList className="bg-muted/50 p-1 rounded-xl flex flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="rounded-lg">
            All products
          </TabsTrigger>
          <TabsTrigger value="bestseller" className="rounded-lg">
            Bestsellers
          </TabsTrigger>
          <TabsTrigger value="in_stock" className="rounded-lg">
            In stock
          </TabsTrigger>
          <TabsTrigger value="out_of_stock" className="rounded-lg">
            Out of stock
          </TabsTrigger>
        </TabsList>
      </Tabs>
      )}

      <Card className={`glass-card border-border/50 ${showFilters ? "mt-4" : ""}`}>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={showFilters ? "Search by name or product ID..." : "Search products..."}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-muted/50 border-none"
              />
            </div>
            {showFilters && (
            <div className="relative w-full sm:w-56">
              <select
                aria-label="Filter by category"
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="w-full appearance-none pl-3 pr-9 py-2 rounded-lg bg-muted/50 text-sm border border-border/50 text-foreground outline-none cursor-pointer"
              >
                <option value="">All categories</option>
                {categories
                  .filter((c) => c.isShow !== false)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name?.trim() || (cat as { nameEn?: string }).nameEn || "Category"}
                    </option>
                  ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-sm">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium">Stock</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" />
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-destructive">
                    Failed to load products.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product._id} className="group hover:bg-muted/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={resolveMediaUrl(product.mainImage)} alt={product.nameEn} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-sm">{product.nameEn}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {getCategoryLabel(product.categoryId as string | { _id?: string; name?: string; nameEn?: string } | undefined)}
                  </td>
                  <td className="py-4 text-sm font-bold">${product.price.toLocaleString()}</td>
                  <td className="py-4 text-sm text-muted-foreground">{product.stock} units</td>
                  <td className="py-4">
                    <Badge variant="secondary" className={product.isShow ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}>
                      {product.isShow ? "Active" : "Hidden"}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link to={`/products/${product._id}`}>
                            <Eye className="w-4 h-4 mr-2" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product._id)}>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          disabled={deletingId === product._id || !onDelete}
                          onSelect={() => onDelete?.(product._id)}
                        >
                          {deletingId === product._id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-2" />
                          )}
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
    </>
  );
};
