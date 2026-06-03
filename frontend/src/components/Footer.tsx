import { Instagram, Facebook, Youtube, Phone, MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onScrollToElement: (id: string) => void;
  onTrackOrderToggle: () => void;
}

export default function Footer({ onScrollToElement, onTrackOrderToggle }: FooterProps) {

  // Custom Tiktok vector since lucide lacks it sometimes
  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.76 4.08.92.83 2.1 1.34 3.32 1.43v3.91a8.21 8.21 0 0 1-5.12-1.78v7.26c0 4.14-3.36 7.5-7.5 7.5S1.4 19.1 1.4 14.96c0-4.04 3.19-7.34 7.21-7.49v3.94a3.52 3.52 0 0 0-3.3 3.55c0 1.96 1.59 3.54 3.54 3.54s3.54-1.59 3.54-3.54V0h.135z" />
    </svg>
  );

  return (
    <footer className="relative bg-[#111111] bg-grain text-cream/70 py-16 px-4 md:px-6 overflow-hidden border-t border-white/5">

      <div className="max-w-7xl mx-auto space-y-12 relative z-10 text-left">

        {/* 4-Column Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

          {/* Column 1: Logo, tagline, socials */}
          <div className="space-y-5">
            <Logo />
            <p className="font-sans text-xs text-cream/50 max-w-sm leading-tight">
              Serving the highest-density, woodfire-baked pizza marvels in the urban sectors. Our recipe rules are unbreakable.
            </p>
            {/* Social media indices */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram className="w-5 h-5" />, href: '#insta' },
                { icon: <TikTokIcon />, href: '#tiktok' },
                { icon: <Facebook className="w-5 h-5" />, href: '#facebook' },
                { icon: <Youtube className="w-5 h-5" />, href: '#youtube' }
              ].map((soc, sIdx) => (
                <a
                  key={sIdx}
                  href={soc.href}
                  onClick={(e) => e.preventDefault()}
                  className="w-10 h-10 rounded-xl bg-[#1e1e1e] hover:bg-cheese text-cheese hover:text-charcoal border border-white/5 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                  title="Follow Pizza Xpert"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold tracking-widest text-[#F5B109] uppercase">
              QUICK SECTIONS
            </h3>
            <ul className="space-y-2.5 font-sans text-xs font-bold uppercase tracking-wider">
              <li>
                <button onClick={() => onScrollToElement('home')} className="hover:text-cheese transition-colors cursor-pointer text-left">
                  HOMEPAGE PORTAL
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToElement('menu')} className="hover:text-cheese transition-colors cursor-pointer text-left">
                  SIGNATURE PIZZA MENU
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToElement('deals')} className="hover:text-cheese transition-colors cursor-pointer text-left">
                  TICKING DISCOUNT OFFERS
                </button>
              </li>
              <li>
                <button onClick={onTrackOrderToggle} className="hover:text-cheese transition-colors cursor-pointer text-left">
                  LIVE ORDER STATUS TRACKER
                </button>
              </li>
              <li>
                <button onClick={() => onScrollToElement('about')} className="hover:text-cheese transition-colors cursor-pointer text-left">
                  ABOUT OUR BAKERS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Order Info */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold tracking-widest text-[#F5B109] uppercase">
              LOGISTICAL INFO
            </h3>
            <ul className="space-y-2.5 font-sans text-xs font-bold uppercase tracking-wider">
              <li>
                <a href="#delivery" onClick={(e) => e.preventDefault()} className="hover:text-cheese transition-colors">
                  Delivery Zone Boundaries
                </a>
              </li>
              <li>
                <a href="#faqs" onClick={(e) => e.preventDefault()} className="hover:text-cheese transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#careers" onClick={(e) => e.preventDefault()} className="hover:text-cheese transition-colors">
                  Join Moto Messenger Squad (Careers)
                </a>
              </li>
              <li className="flex items-center gap-2 text-olive font-extrabold text-[10px]">
                <ShieldCheck className="w-4 h-4 text-olive animate-pulse" />
                Durable FSC-Grade Craft Boxes Used
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Details */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold tracking-widest text-[#F5B109] uppercase">
              CONTACT & IN-HANDS
            </h3>
            <ul className="space-y-3 font-sans text-xs text-cream/60 font-semibold">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cheese flex-shrink-0" />
                <span>HOTLINE: 1-800-PIZZA-XPERT (749-929)</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cheese flex-shrink-0" />
                <span>847 Artisan Ave, Oven District, NY 10013</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cheese flex-shrink-0" />
                <span>hq@pizzaxpert.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-cheese flex-shrink-0" />
                <span>Open Daily: 10:00 AM - 04:00 AM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & secure digital cards */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans font-bold text-cream/40 uppercase tracking-wider">

          <div>
            © {new Date().getFullYear()} PIZZA XPERT BRAND LLC. EXPERTISE IN EVERY SLICE!
          </div>

          {/* Payment currencies */}
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'EasyPaisa', 'COD (Hand Cash)'].map((pm, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#1e1e1e] border border-white/5 rounded text-[10px] text-cream/60 tracking-widest font-mono"
              >
                {pm}
              </span>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}
