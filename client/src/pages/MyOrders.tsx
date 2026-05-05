import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, PackageSearch, Calendar, CreditCard, Truck } from "lucide-react";
import { orderService } from "@/api/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveMediaUrl } from "@/lib/media-url";

const statusClassMap: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PROCESSING: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  SHIPPED: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  DELIVERED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
  RETURNED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

const MyOrders = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderService.getMyOrders({ page: 1, limit: 20 }),
  });

  const orders = data?.data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        Failed to load your orders.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="section-padding max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-1">Track your current and previous orders.</p>
        </div>

        {orders.length === 0 ? (
          <Card className="glass-card border-dashed">
            <CardContent className="py-16 text-center">
              <PackageSearch className="h-12 w-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">You have not placed any orders yet.</p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
              >
                <Card className="glass-card border-border/40">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle className="text-base">
                        #{order.trackingNumber || order._id.slice(-8).toUpperCase()}
                      </CardTitle>
                      <Badge className={statusClassMap[order.status] || "bg-muted text-foreground"}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.items.slice(0, 3).map((item, itemIndex) => (
                      <div key={`${order._id}-${itemIndex}`} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={resolveMediaUrl(item.image || item.productId?.images?.main || item.productId?.mainImage)}
                            alt={item.name}
                            className="w-12 h-12 rounded-md object-cover border border-border/50"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} {item.size ? `- Size: ${item.size}` : ""}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}

                    {order.items.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{order.items.length - 3} more item(s)</p>
                    )}

                    <div className="pt-3 border-t border-border/40 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
