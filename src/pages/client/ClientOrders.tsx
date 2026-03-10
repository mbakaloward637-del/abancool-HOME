import { useEffect, useState } from "react";
import { fetchOrders } from "@/lib/whmcs-api";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-accent/10 text-accent border-accent/20";
      case "fraud": case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold">Order History</h1>
        <p className="text-muted-foreground text-sm mt-1">View your past orders</p>
      </div>

      <div className="bg-card rounded-sm border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Order #</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Date</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">#{o.ordernum || o.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{o.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={statusColor(o.status)}>{o.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">KES {o.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
