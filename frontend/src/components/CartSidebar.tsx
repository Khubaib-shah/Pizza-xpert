import { useState, FormEvent } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, ChevronRight, ShoppingBag, Bike } from 'lucide-react';
import { CartItem, SimulatedOrder, OrderStage } from '../types';
import { TextInput, PhoneInput } from './form';
import { isAlphaName, isPakistaniPhone, sanitizeNameInput, isRequired } from '../utils/validation';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (order: SimulatedOrder) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartSidebarProps) {

  // Checkout Details form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (value: string) => {
    setName(sanitizeNameInput(value));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
  };

  if (!isOpen) return null;

  // Pricing math sum
  const subtotal = cart.reduce((acc, item) => acc + item.pricePerItem * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = subtotal > 25 || subtotal === 0 ? 0.00 : 3.99; // Free over $25
  const grandTotal = Number((subtotal + tax + deliveryFee).toFixed(2));

  // Validate and Submit Checkout Form
  const handleSubmitOrder = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};

    const nameValidation = isAlphaName(name);
    if (!nameValidation.valid) validationErrors.name = nameValidation.error ?? 'Full name is required';

    const phoneValidation = isPakistaniPhone(phone);
    if (!phoneValidation.valid) validationErrors.phone = phoneValidation.error ?? 'Phone number is required';

    if (!isRequired(address)) {
      validationErrors.address = 'Delivery address is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);

    // Simulate cooking processing speed
    setTimeout(() => {
      const order: SimulatedOrder = {
        id: `XPERT-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        paymentMethod,
        createdAt: new Date().toISOString(),
        stage: 'placed',
        deliveryTimeRemaining: 1800, // 30 minutes in seconds
        totalAmount: grandTotal,
        customerDetails: { name, phone, address }
      };

      onCheckout(order);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">

      {/* Black Modal Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Slide drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-charcoal bg-grain border-l border-white/10 flex flex-col justify-between shadow-2xl relative">

          {/* Header Row */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-charcoal/90 z-10">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-cheese animate-bounce" />
              <h2 className="font-display text-2xl font-black text-white uppercase tracking-wide">
                YOUR CRAFT CART
              </h2>
              <span className="bg-burgundy text-cheese font-mono text-[10px] font-black px-2 py-0.5 rounded-full border border-tomato/20">
                {cart.length} PIECES
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-cream/70 hover:text-cheese transition-colors cursor-pointer"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Core Scroll Content panel */}
          <div className="flex-grow overflow-y-auto p-5 space-y-6">
            {cart.length > 0 ? (
              <>
                {/* List of Cart Items */}
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-charcoal-light/60 border border-white/5 rounded-2xl p-4 flex gap-4 transition-all hover:border-burgundy/10 text-left relative"
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={item.pizza.image}
                        alt={item.pizza.name}
                        className="w-16 h-16 object-cover rounded-xl border border-white/10 filter saturate-1.2"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-grow space-y-1.5 min-w-0">

                        {/* Title and delete */}
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-display text-base font-black text-white uppercase truncate">
                            {item.pizza.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-cream/30 hover:text-tomato transition-colors p-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Pizza configuration specifications details */}
                        <div className="space-y-1 text-[10px] text-cream/50 bg-black/20 p-2 rounded-lg border border-white/5 leading-tight">
                          <div>
                            • <b className="text-cheese">SIZE:</b> {item.customization.size}
                          </div>
                          <div>
                            • <b className="text-cheese">CRUST:</b> {item.customization.crust}
                          </div>
                          <div>
                            • <b className="text-cheese">BASE:</b> {item.customization.sauce}
                          </div>
                          {item.customization.extraCheese && (
                            <div className="text-cheese font-black">
                              • UPGRADE: DOUBLE CHEZ CAVITY ADD
                            </div>
                          )}
                          {item.customization.extraToppings.length > 0 && (
                            <div className="truncate">
                              • <b className="text-tomato">TOPPINGS:</b> {item.customization.extraToppings.join(', ')}
                            </div>
                          )}
                        </div>

                        {/* Quantity controls and pricing */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 bg-charcoal border border-white/5 rounded-lg py-1 px-2 text-xs font-medium text-white">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="text-cream/50 hover:text-cheese"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="text-cream/50 hover:text-cheese"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="font-mono text-sm font-black text-cheese">
                            ${(item.pricePerItem * item.quantity).toFixed(2)}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal summary card */}
                <div className="bg-charcoal-light/40 rounded-2xl p-4.5 border border-white/5 space-y-2.5 text-xs text-cream/70 font-bold">
                  <div className="flex justify-between">
                    <span>ITEMS TOTAL</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATE GST TAX (8%)</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SPEED MOTO COURIER</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <span className="text-olive">FREE TODAY</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="text-[10px] text-cheese/70 font-semibold uppercase text-center border border-dashed border-cheese/10 p-1.5 rounded bg-cheese/5">
                      💡 Add ${(25 - subtotal).toFixed(2)} more to secure FREE delivery fee
                    </div>
                  )}
                  <div className="pt-3 border-t border-white/5 flex justify-between text-sm font-black text-white uppercase">
                    <span>GRAND COMBINED TOTAL</span>
                    <span className="font-display text-2xl text-cheese text-glow-gold">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Integrated checkout form inside the drawer context */}
                <form onSubmit={handleSubmitOrder} className="bg-charcoal-light/80 border border-[var(--color-tomato)08] rounded-24px p-4.5 text-left space-y-4">
                  <h3 className="font-display text-lg font-black text-cheese uppercase tracking-wide border-b border-white/5 pb-2">
                    🏎 INSTANT DISPATCH DETAILS
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    {/* Name */}
                    <TextInput
                      label="Recipient Full Name"
                      name="recipientName"
                      placeholder="e.g. Zack Knight"
                      value={name}
                      onChange={handleNameChange}
                      error={errors.name}
                    />

                    {/* Phone */}
                    <PhoneInput
                      label="Phone Number (delivery rider contact)"
                      name="deliveryPhone"
                      placeholder="e.g. 0312 1212121"
                      value={phone}
                      onChange={handlePhoneChange}
                      error={errors.phone}
                    />

                    {/* Address */}
                    <div className="space-y-1">
                      <label className="text-cream/50 uppercase font-bold tracking-widest block">Delivery Address (Door No / Floor / Apt)</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Apt 4B, 847 Artisan Ave, Oven District"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-charcoal-dark border border-white/5 hover:border-white/10 rounded-lg py-2.5 px-3 text-cream focus:outline-none focus:border-cheese resize-none"
                      />
                      {errors.address && <p className="text-[10px] text-tomato font-bold uppercase">{errors.address}</p>}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-1">
                      <label className="text-cream/50 uppercase font-bold tracking-widest block">Payment Protocol</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full bg-charcoal-dark border border-white/5 hover:border-white/10 rounded-lg py-2.5 px-3 text-cream focus:outline-none focus:border-cheese"
                      >
                        <option value="Cash on Delivery (COD)">Cash on Delivery (COD) / Card on Door</option>
                        <option value="Debit Card Transfer (Visa/Mastercard)">Secure Digital Card (Visa/MC Sim)</option>
                        <option value="EasyPaisa Wallet">EasyPaisa digital cash</option>
                      </select>
                    </div>

                  </div>

                  {/* Submit Order button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-tomato text-white hover:bg-cheese hover:text-charcoal font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 btn-cheese-shadow flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isProcessing ? (
                      <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        DISPATCH SACRED HEARTH PIZZA
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center py-12 px-4 space-y-4">
                <ShoppingBag className="w-16 h-16 text-cheese/30 animate-pulse" />
                <h3 className="font-display text-2xl font-black text-white uppercase">
                  YOUR CART IS EMPTY
                </h3>
                <p className="font-sans text-xs text-cream/50 max-w-xs font-semibold">
                  You haven't added any woodfire masterpieces to your plate yet. Swipe back to the signatures menu!
                </p>
                <button
                  onClick={onClose}
                  className="bg-burgundy text-cheese hover:bg-tomato hover:text-white border border-cheese/10 py-3.5 px-6 rounded-xl font-sans font-black text-xs uppercase tracking-widest transition-all"
                >
                  Return to signatures
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
