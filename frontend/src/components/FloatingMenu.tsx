import { useState } from 'react';
import { Plus, MessageCircle, MapPin, ArrowUp } from 'lucide-react';

export default function FloatingMenu({ onTrackOrder }: { onTrackOrder: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/923001234567', '_blank');
    setIsOpen(false);
  };

  const handleTrackOrder = () => {
    onTrackOrder();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      <div className="relative w-14 h-14">
        
        {/* Track Order Item */}
        <button 
          onClick={handleTrackOrder}
          className={`absolute w-12 h-12 rounded-full bg-charcoal text-cream flex items-center justify-center shadow-lg transition-all duration-300 transform ${isOpen ? '-translate-y-16 scale-100 opacity-100 hover:bg-tomato' : 'translate-y-0 scale-50 opacity-0 pointer-events-none'}`}
          title="Track Order"
        >
          <MapPin className="w-5 h-5" />
        </button>

        {/* WhatsApp Item */}
        <button 
          onClick={handleWhatsApp}
          className={`absolute w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg transition-all duration-300 delay-75 transform ${isOpen ? '-translate-y-12 -translate-x-12 scale-100 opacity-100 hover:bg-[#128C7E]' : 'translate-y-0 translate-x-0 scale-50 opacity-0 pointer-events-none'}`}
          title="Contact WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Back to Top Item */}
        <button 
          onClick={scrollToTop}
          className={`absolute w-12 h-12 rounded-full bg-cream text-charcoal border border-charcoal/10 flex items-center justify-center shadow-lg transition-all duration-300 delay-150 transform ${isOpen ? '-translate-x-16 scale-100 opacity-100 hover:bg-cheese' : 'translate-x-0 scale-50 opacity-0 pointer-events-none'}`}
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Main Toggle Button */}
        <button 
          onClick={toggleMenu}
          className={`absolute inset-0 w-14 h-14 rounded-full bg-tomato text-white flex items-center justify-center shadow-xl transition-transform duration-300 hover:bg-burgundy ${isOpen ? 'rotate-[315deg]' : 'rotate-0'}`}
        >
          <Plus className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
