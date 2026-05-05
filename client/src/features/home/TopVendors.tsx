import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/api-client";
import { ENDPOINTS } from "@/api/endpoints";
import { motion } from "framer-motion";
import { Store, Star, Package, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveMediaUrl } from "@/lib/media-url";

interface Vendor {
  _id: string;
  name: string;
  picture?: string;
  totalOrders: number;
}

export function TopVendors() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["top-vendors"],
    queryFn: () => apiClient.get<unknown, { data: { vendors: Vendor[] } }>(ENDPOINTS.VENDOR.TOP),
  });

  const vendors = response?.data?.vendors || [];

  if (isLoading) {
    return (
      <section className="py-24 section-padding">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </section>
    );
  }

  if (vendors.length === 0) return null;

  return (
    <section className="py-24 section-padding bg-secondary/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

      <div className="flex items-end justify-between mb-16 relative z-10">
        <div>
          <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">
            Top <span className="gradient-text">Vendors</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Discover the most trusted and top-rated sellers in our marketplace.
          </p>
        </div>
        <Link 
          to="/products" 
          className="hidden md:flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all"
        >
          Explore All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {vendors.map((vendor, index) => (
          <motion.div
            key={vendor._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group glass-card rounded-[24px] p-6 hover:border-accent/30 transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-xl">
                  {vendor.picture ? (
                    <img 
                      src={resolveMediaUrl(vendor.picture)} 
                      alt={vendor.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent text-accent-foreground flex items-center justify-center text-3xl font-bold uppercase">
                      {vendor.name.substring(0, 2)}
                    </div>
                  )}
                </div>
                {index === 0 && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-background">
                    <Star className="h-4 w-4 fill-white" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold font-playfair mb-2">{vendor.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Store className="h-4 w-4 text-accent" />
                <span>Verified Seller</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-accent mb-1">
                    <Package className="h-4 w-4" />
                    <span className="font-bold text-foreground">{vendor.totalOrders || 0}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Orders</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span className="font-bold text-foreground">4.9</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Rating</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
