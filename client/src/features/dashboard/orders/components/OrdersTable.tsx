import { OrderListItem } from "@/api/dashboard-management.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Loader2, Search, Truck } from "lucide-react";
import { getOrderStatusColor } from "./orders.types";

interface OrdersTableProps {
  orders: OrderListItem[];
  search: string;
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onView: (id: string) => void;
  onEdit: (id: string, status: string) => void;
}

export const OrdersTable = ({
  orders,
  search,
  isLoading,
  isError,
  onSearchChange,
  onView,
  onEdit,
}: OrdersTableProps) => (
  <>
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-muted/50 p-1 rounded-xl">
        <TabsTrigger value="all" className="rounded-lg">All Orders</TabsTrigger>
        <TabsTrigger value="processing" className="rounded-lg">Processing</TabsTrigger>
        <TabsTrigger value="shipped" className="rounded-lg">Shipped</TabsTrigger>
        <TabsTrigger value="delivered" className="rounded-lg">Delivered</TabsTrigger>
        <TabsTrigger value="cancelled" className="rounded-lg">Cancelled</TabsTrigger>
      </TabsList>
    </Tabs>
    <Card className="glass-card border-border/50">
      <CardHeader>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-muted/50 border-none"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-sm">
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Payment</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading && <tr><td colSpan={7} className="py-10 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /></td></tr>}
              {isError && <tr><td colSpan={7} className="py-10 text-center text-sm text-destructive">Failed to load orders.</td></tr>}
              {!isLoading && !isError && orders.length === 0 && <tr><td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No orders found.</td></tr>}
              {orders.map((order) => (
                <tr key={order._id} className="group hover:bg-muted/30 transition-colors">
                  <td className="py-4 font-bold text-sm text-accent">{order.trackingNumber ?? order._id.slice(-8)}</td>
                  <td className="py-4 text-sm font-medium">{order.recipientName}</td>
                  <td className="py-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 text-sm font-bold">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-4"><Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">{order.paymentStatus}</Badge></td>
                  <td className="py-4"><Badge variant="secondary" className={`${getOrderStatusColor(order.status)} border-none`}>{order.status}</Badge></td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="View Details" onClick={() => onView(order._id)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" title="Update Status" onClick={() => onEdit(order._id, order.status)}><Truck className="w-4 h-4 text-accent" /></Button>
                    </div>
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
