import React from 'react';
import { Search } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

interface OrdersManagementProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  orderFilter: string;
  setOrderFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedOrders: string[];
  setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelectAllOrders: () => void;
  handleToggleSelectOrder: (id: string) => void;
  handleAdvanceKanban: (id: string) => void;
}

export default function OrdersManagement({
  orders, setOrders, orderFilter, setOrderFilter, searchQuery, setSearchQuery,
  selectedOrders, setSelectedOrders, handleSelectAllOrders, handleToggleSelectOrder, handleAdvanceKanban
}: OrdersManagementProps) {
  return (
    <div className="space-y-6">
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setOrderFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-extrabold cursor-pointer transition-colors ${
                orderFilter === f
                  ? 'bg-cheese text-black'
                  : 'bg-charcoal-800 text-cream/80 hover:bg-[#2c2c2c]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search orders */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Filter customer / code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-charcoal border border-charcoal-border rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-white w-full focus:outline-none focus:border-cheese"
          />
          <Search className="w-4 h-4 text-cream/40 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bulk operations dashboard */}
      {selectedOrders.length > 0 && (
        <div className="bg-burgundy/30 border border-cheese/30 rounded-xl p-3 flex items-center justify-between animate-fade-in text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cheese font-medium">{selectedOrders.length} ORDERS SELECTED</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, status: 'Ready' } : o));
                setSelectedOrders([]);
              }}
            >
              Mark as Ready
            </Button>
            <Button
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-500 border-none text-white"
              onClick={() => {
                setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? { ...o, rider: 'Rider Vicky' } : o));
                setSelectedOrders([]);
              }}
            >
              Assign Rider Vicky
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                alert(`Generating labels container for: ${selectedOrders.join(', ')}`);
              }}
            >
              Print Slips
            </Button>
          </div>
        </div>
      )}

      {/* Big central list */}
      <div className="bg-charcoal border border-charcoal-border rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-charcoal-black border-b border-charcoal-800 text-cream/40 uppercase font-medium text-[10px] tracking-wider select-none">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={handleSelectAllOrders}
                  className="rounded text-cheese"
                />
              </th>
              <th className="p-4">ID</th>
              <th className="p-4">Stamp</th>
              <th className="p-4">Client</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Courier assigned</th>
              <th className="p-4">Docket Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Trigger workflow</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-800">
            {orders
              .filter(o => orderFilter === 'ALL' || o.status === orderFilter)
              .filter(o => o.customer.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(o => {
                const isChecked = selectedOrders.includes(o.id);
                return (
                  <tr key={o.id} className={`hover:bg-charcoal-800/20 transition-all font-mono ${isChecked ? 'bg-yellow-500/5' : ''}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelectOrder(o.id)}
                        className="rounded text-cheese"
                      />
                    </td>
                    <td className="p-4 font-medium text-cheese">{o.id}</td>
                    <td className="p-4 text-cream/50">{o.time}</td>
                    <td className="p-4 font-sans font-medium text-white">{o.customer}</td>
                    <td className="p-4 font-sans text-cream/70 truncate max-w-xs">{o.items}</td>
                    <td className="p-4 font-sans text-xs">{o.payment}</td>
                    <td className="p-4 font-sans font-medium text-cheese/80">{o.rider}</td>
                    <td className="p-4 text-white font-medium">Rs{o.total}</td>
                    <td className="p-4">
                      <Badge variant={
                        o.status === 'Pending' ? 'warning' :
                        o.status === 'Preparing' ? 'info' :
                        o.status === 'Ready' ? 'neutral' :
                        o.status === 'Delivered' ? 'success' : 'error'
                      }>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdvanceKanban(o.id)}
                        >
                          Advance Step →
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
