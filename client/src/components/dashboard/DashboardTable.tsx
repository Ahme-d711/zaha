import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface DashboardTableProps {
  orders?: any[];
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "DELIVERED": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
    case "PROCESSING": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "SHIPPED": return "bg-violet-500/10 text-violet-500 hover:bg-violet-500/20";
    case "PENDING": return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "CANCELLED": return "bg-destructive/10 text-destructive hover:bg-destructive/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export const DashboardTable = ({ orders }: DashboardTableProps) => {
  return (
    <Card className="glass-card border-border/50 mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold font-playfair tracking-tight">Recent Orders</CardTitle>
        <button className="text-sm font-medium text-accent hover:underline">View All</button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground text-sm">
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {orders?.map((order) => (
                <tr key={order._id} className="group hover:bg-muted/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-accent/10 text-accent text-xs">
                          {order.userId?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{order.userId?.name}</p>
                        <p className="text-xs text-muted-foreground">{order.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm font-medium">
                    {order.items[0]?.productName || "Product"}
                    {order.items.length > 1 && ` (+${order.items.length - 1})`}
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="py-4 text-sm font-bold">${order.totalAmount.toLocaleString()}</td>
                  <td className="py-4">
                    <Badge variant="secondary" className={getStatusColor(order.status) + " border-none"}>
                      {order.status}
                    </Badge>
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
