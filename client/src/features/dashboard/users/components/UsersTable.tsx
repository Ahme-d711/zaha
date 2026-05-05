import { UserListItem } from "@/api/dashboard-management.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Filter, Loader2, Mail, MoreHorizontal, Search, UserCheck, UserX } from "lucide-react";

interface UsersTableProps {
  users: UserListItem[];
  search: string;
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export const UsersTable = ({
  users,
  search,
  isLoading,
  isError,
  onSearchChange,
  onView,
  onEdit,
}: UsersTableProps) => (
  <Card className="glass-card border-border/50">
    <CardHeader>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/50 border-none"
          />
        </div>
        <Button variant="outline" size="sm" className="border-border/50">
          <Filter className="w-4 h-4 mr-2" />
          All Roles
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50 text-muted-foreground text-sm">
              <th className="pb-4 font-medium">User</th>
              <th className="pb-4 font-medium">Role</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {isLoading && <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>}
            {isError && <tr><td colSpan={4} className="py-10 text-center text-sm text-destructive">Failed to load users.</td></tr>}
            {users.map((user) => (
              <tr key={user._id} className="group hover:bg-muted/30 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-accent/10 text-accent">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4"><Badge variant="outline" className="border-border/50">{user.role?.toUpperCase()}</Badge></td>
                <td className="py-4"><Badge variant="secondary" className={user.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}>{user.isActive ? "Active" : "Inactive"}</Badge></td>
                <td className="py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(user._id)}><Mail className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user._id)}><UserCheck className="w-4 h-4 mr-2" />Edit User</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive"><UserX className="w-4 h-4 mr-2" />Block User</DropdownMenuItem>
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
