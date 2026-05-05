import { Button } from "@/components/ui/button";

interface OrdersHeaderProps {
  onExportCsv: () => void;
  onPrintLabels: () => void;
  actionsDisabled?: boolean;
}

export const OrdersHeader = ({ onExportCsv, onPrintLabels, actionsDisabled }: OrdersHeaderProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold font-playfair tracking-tight">Orders</h1>
      <p className="text-muted-foreground mt-1">Track and manage customer orders and shipments.</p>
    </div>
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        className="border-border/50"
        disabled={actionsDisabled}
        onClick={onExportCsv}
      >
        Export CSV
      </Button>
    </div>
  </div>
);
