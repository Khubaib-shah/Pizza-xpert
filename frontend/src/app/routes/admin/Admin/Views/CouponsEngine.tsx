import React from 'react';
import Badge from '../../../../../shared/components/ui/Badge';
import Button from '../../../../../shared/components/ui/Button';
import TextInput from '../../../../../shared/components/form/TextInput';

interface CouponsEngineProps {
  coupons: any[];
  setCoupons: React.Dispatch<React.SetStateAction<any[]>>;
  newCoupon: any;
  setNewCoupon: React.Dispatch<React.SetStateAction<any>>;
  handleGenerateCouponCode: () => void;
}

export default function CouponsEngine({
  coupons, setCoupons, newCoupon, setNewCoupon, handleGenerateCouponCode
}: CouponsEngineProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 space-y-0">
      {/* Creator coupon form */}
      <div className="lg:col-span-5 bg-charcoal p-5 border border-charcoal-border rounded-2xl space-y-4 h-fit">
        <h4 className="text-xs uppercase tracking-widest font-medium text-cheese pb-2 border-b border-charcoal-border">COUPON FACTORY SETTINGS</h4>
        <div className="space-y-3 text-xs">
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <TextInput
                label="Campaign Code"
                name="campaignCode"
                placeholder="e.g. WOODFIRE45"
                value={newCoupon.code}
                onChange={val => setNewCoupon((prev: any) => ({ ...prev, code: val }))}
              />
            </div>
            <Button
              variant="outline"
              onClick={handleGenerateCouponCode}
              className="py-2.5 h-[42px]"
            >
              Autogen
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <TextInput
                label="Discount String"
                name="discountString"
                placeholder="e.g. 15% or Rs100 Flat"
                value={newCoupon.discount}
                onChange={val => setNewCoupon((prev: any) => ({ ...prev, discount: val }))}
              />
            </div>
            <div className="space-y-1">
              <label className="text-cream/40 uppercase font-mono tracking-widest text-[11px]">Coupon System</label>
              <select
                value={newCoupon.type}
                onChange={e => setNewCoupon((prev: any) => ({ ...prev, type: e.target.value }))}
                className="w-full bg-charcoal border border-charcoal-light rounded-lg p-2.5 text-white focus:outline-none focus:border-cheese"
              >
                <option value="Percentage">Percentage</option>
                <option value="Flat">Flat Discount</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <TextInput
                label="Min Ticket (INR)"
                name="minTicket"
                type="number"
                placeholder="499"
                value={newCoupon.minOrder}
                onChange={val => setNewCoupon((prev: any) => ({ ...prev, minOrder: val }))}
              />
            </div>
            <div className="space-y-1">
              <TextInput
                label="Expiry timeline"
                name="expiryTimeline"
                placeholder="2026-06-30"
                value={newCoupon.expiry}
                onChange={val => setNewCoupon((prev: any) => ({ ...prev, expiry: val }))}
              />
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full py-3"
            onClick={() => {
              if (newCoupon.code && newCoupon.discount) {
                setCoupons(prev => [...prev, {
                  code: newCoupon.code,
                  discount: newCoupon.discount,
                  type: newCoupon.type,
                  minOrder: Number(newCoupon.minOrder) || 400,
                  uses: 0,
                  expiry: newCoupon.expiry || '2026-06-30',
                  status: 'Active'
                }]);
                setNewCoupon({ code: '', discount: '', type: 'Percentage', minOrder: '', expiry: '' });
              }
            }}
          >
            Deploy Active Campaign Code
          </Button>
        </div>
      </div>

      {/* Coupons List Table */}
      <div className="lg:col-span-7 bg-charcoal p-4 border border-charcoal-border rounded-2xl overflow-x-auto text-xs space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-medium uppercase text-white">REVENUE PROMO CAMPAIGN REGISTRY</h4>
          <span className="text-[10px] text-cream/40 font-mono">TRACKING: CTR PERFORMANCE</span>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-charcoal-black text-cream/40 border-b border-charcoal-border font-medium text-[10px] uppercase">
              <th className="p-3">CODE</th>
              <th className="p-3">VALUE</th>
              <th className="p-3">MIN CART</th>
              <th className="p-3">CTR REDEEMS</th>
              <th className="p-3">EXP EXPIRY</th>
              <th className="p-3">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-800 font-mono">
            {coupons.map((c, idx) => (
              <tr key={idx} className="hover:bg-charcoal-gray">
                <td className="p-3 text-cheese font-medium">{c.code}</td>
                <td className="p-3 text-white">{c.discount}</td>
                <td className="p-3">Rs{c.minOrder}</td>
                <td className="p-3 text-emerald-400 font-medium">{c.uses} Uses</td>
                <td className="p-3 text-cream/50">{c.expiry}</td>
                <td className="p-3">
                  <Badge variant={c.status === 'Active' ? 'success' : 'neutral'}>
                    {c.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
