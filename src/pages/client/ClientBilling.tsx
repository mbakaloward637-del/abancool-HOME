import { useEffect, useState } from "react";
import { fetchInvoices } from "@/lib/whmcs-api";
import { FileText, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientBilling() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const status = filter === "All" ? undefined : filter;
    setLoading(true);
    fetchInvoices(status)
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "unpaid": return "bg-destructive/10 text-destructive border-destructive/20";
      case "overdue": return "bg-destructive/10 text-destructive border-destructive/20";
      case "cancelled": return "bg-muted text-muted-foreground border-border";
      default: return "bg-accent/10 text-accent border-accent/20";
    }
  };

  const filters = ["All", "Unpaid", "Paid", "Overdue", "Cancelled"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage your invoices</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              filter === f
                ? "bg-accent text-accent-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-sm border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Invoice #</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Date</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Due Date</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Amount</th>
                  <th className="text-left px-6 py-3.5 font-semibold text-foreground">Status</th>
                  <th className="text-right px-6 py-3.5 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => (
                  <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">#{inv.invoicenum || inv.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inv.date}</td>
                    <td className="px-6 py-4 text-muted-foreground">{inv.duedate}</td>
                    <td className="px-6 py-4 font-medium">KES {inv.total}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={statusColor(inv.status)}>{inv.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`https://abancool.com/clients/viewinvoice.php?id=${inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-accent hover:underline text-sm font-medium"
                      >
                        {inv.status?.toLowerCase() === "unpaid" ? "Pay Now" : "View"} <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
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
