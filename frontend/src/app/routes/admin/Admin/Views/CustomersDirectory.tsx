import React from "react";
import { Search, X } from "lucide-react";
import Badge from "../../../../../shared/components/ui/Badge";
import Button from "../../../../../shared/components/ui/Button";

interface CustomersDirectoryProps {
  customers: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any | null) => void;
}

export default function CustomersDirectory({
  customers,
  searchQuery,
  setSearchQuery,
  selectedCustomer,
  setSelectedCustomer,
}: CustomersDirectoryProps) {
  return (
    <div className="space-y-6 relative">
      {/* Search + filter bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search name, phone or tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-charcoal border border-charcoal-border rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-white w-full focus:outline-none focus:border-cheese"
          />
          <Search className="w-4 h-4 text-cream/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs uppercase text-cheese font-mono">
          {customers.length} ACTIVE RECORDS LOADED
        </div>
      </div>

      {/* Table */}
      <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-charcoal-black border-b border-charcoal-800 text-cream/40 uppercase font-medium text-[10px] tracking-wider select-none">
              <th className="p-4">Customer ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Registered Mobile</th>
              <th className="p-4">Lifetime Orders</th>
              <th className="p-4">Spend Index</th>
              <th className="p-4">Loyalty Tier</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-800">
            {customers
              .filter(
                (c) =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.tier.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-charcoal-800/20 transition-all font-mono"
                >
                  <td className="p-4 font-medium text-cream/50">{c.id}</td>
                  <td className="p-4 font-sans font-medium text-white">
                    {c.name}
                  </td>
                  <td className="p-4 text-cream/90">{c.phone}</td>
                  <td className="p-4 text-center font-medium text-white">
                    {c.orders}
                  </td>
                  <td className="p-4 text-emerald-400 font-medium">
                    Rs{c.spend.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        c.tier === "VIP"
                          ? "outline"
                          : c.tier === "Returning"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {c.tier}
                    </Badge>
                  </td>
                  <td className="p-4 text-cream/50">{c.lastOrder}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="text-cheese hover:underline uppercase text-[10px] font-medium"
                    >
                      Explore Dossier →
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* SLIDING REGISTER DETAIL DRAWER */}
      {selectedCustomer && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-charcoal-black/95 backdrop-blur-xl border-l border-charcoal-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 p-6 flex flex-col justify-between animate-slide-in">
          <div>
            {/* Header line */}
            <div className="flex justify-between items-center pb-4 border-b border-charcoal-border">
              <span className="text-[10px] uppercase font-mono text-cheese">
                Client Profile Explorer
              </span>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 bg-white/5 rounded-full text-white hover:text-red-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Detail Body */}
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-burgundy rounded-2xl flex items-center justify-center border-2 border-cheese font-display text-2xl font-medium text-white">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">
                    {selectedCustomer.name}
                  </h3>
                  <span className="text-xs text-cream/40 font-mono">
                    {selectedCustomer.id} | Loyalty: {selectedCustomer.tier}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-charcoal p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-cream/40 uppercase font-mono block">
                    Lifetime Billings
                  </span>
                  <span className="text-lg font-mono font-medium text-white">
                    Rs{selectedCustomer.spend.toLocaleString()}
                  </span>
                </div>
                <div className="bg-charcoal p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-cream/40 uppercase font-mono block">
                    Aggregate orders
                  </span>
                  <span className="text-lg font-mono font-medium text-cheese">
                    {selectedCustomer.orders} Meals
                  </span>
                </div>
              </div>

              <div className="space-y-2 bg-charcoal p-4 rounded-xl border border-white/5 text-xs text-cream/90">
                <strong className="text-white uppercase font-mono block text-[10px] pb-1 border-b border-charcoal-light">
                  CRM PREFERENCES
                </strong>
                <p>
                  <strong>Primary Address:</strong> sector 14, Penthouse Wing,
                  Tech City, Gurgaon, India
                </p>
                <p>
                  <strong>Topping Magnet:</strong> Sizzling Pepperoni, Roast
                  Garlic Crown
                </p>
                <p>
                  <strong>Drip Preference:</strong> Double extra cheese crusts
                  always
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="danger"
            className="w-full mt-4"
            onClick={() => setSelectedCustomer(null)}
          >
            Close Dossier
          </Button>
        </div>
      )}
    </div>
  );
}
