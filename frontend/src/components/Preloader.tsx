interface PreloaderProps {
  message?: string;
}

export default function Preloader({ message = 'Preparing your pizza experience...' }: PreloaderProps) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black-pure text-cream">
      <div className="rounded-3xl border border-white/10 bg-charcoal-black/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.65)] text-center max-w-sm w-full mx-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-cheese/30 bg-charcoal mb-6">
          <div className="h-12 w-12 rounded-full border-t-4 border-cheese animate-spin" />
        </div>
        <h1 className="text-xl font-black uppercase tracking-[0.3em] text-cheese mb-3">Loading</h1>
        <p className="text-sm text-cream/80 leading-tight">{message}</p>
      </div>
    </div>
  );
}
