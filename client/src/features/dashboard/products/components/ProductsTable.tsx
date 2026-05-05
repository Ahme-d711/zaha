import { Eye, Edit, Filter, Loader2, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { ProductListItem } from "@/api/dashboard-management.service";
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
import { resolveMediaUrl } from "@/lib/media-url";
import { Link } from "react-router-dom";

interface ProductsTableProps {
  products: ProductListItem[];
  search: string;
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  getCategoryLabel: (categoryId?: string | { _id?: string; name?: string; nameEn?: string }) => string;
}

export const ProductsTable = ({
  products,
  search,
  isLoading,
  isError,
  onSearchChange,
  onView,
  onEdit,
  getCategoryLabel,
}: ProductsTableProps) => {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-muted/50 border-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="border-border/50">
              Export
            </Button>
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
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
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
  );
};
