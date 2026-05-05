import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  onAdd: () => void;
}

export const UsersHeader = ({ onAdd }: UsersHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold font-playfair tracking-tight">Users Management</h1>
      <p className="text-muted-foreground mt-1">Manage user accounts, roles, and permissions.</p>
    </div>
    <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={onAdd}>
      <UserPlus className="w-4 h-4 mr-2" />
      Invite User
    </Button>
  </div>
);
