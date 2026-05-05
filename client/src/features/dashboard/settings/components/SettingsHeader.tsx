import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

export const SettingsHeader = ({ onSave, isSaving }: SettingsHeaderProps) => (
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-3xl font-bold font-playfair tracking-tight">Settings</h1>
      <p className="text-muted-foreground mt-1">Configure your store's general settings and preferences.</p>
    </div>
    <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20" onClick={onSave} disabled={isSaving}>
      <Save className="w-4 h-4 mr-2" />
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
  </div>
);
