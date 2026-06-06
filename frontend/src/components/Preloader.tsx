interface PreloaderProps {
  message?: string;
}

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-charcoal">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Rings */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`ring-${i}`}
            className="absolute w-4 h-52 rounded-full bg-charcoal-border"
            style={{
              transform: `rotate(${i * 20}deg)`,
            }}
          />
        ))}

        {/* Balls */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`ball-${i}`}
            className="absolute w-4 h-52"
            style={{
              transform: `rotate(${i * 20}deg)`,
            }}
          >
            <div
              className="w-4 h-4 rounded-full bg-cheese shadow-[0_0_20px_rgba(255,204,0,0.6)] animate-loader-ball"
              style={{
                animationDelay: `${i * 0.2}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}