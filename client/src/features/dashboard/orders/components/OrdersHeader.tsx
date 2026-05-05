import { Button } from "@/components/ui/button";

export const OrdersHeader = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <h1 className="text-3xl font-bold font-playfair tracking-tight">Orders</h1>
      <p className="text-muted-foreground mt-1">Track and manage customer orders and shipments.</p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" className="border-border/50">Export CSV</Button>
      <Button className="bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20">Print Labels</Button>
    </div>
  </div>
);
