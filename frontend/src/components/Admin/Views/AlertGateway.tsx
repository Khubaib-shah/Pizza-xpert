import React from 'react';
import Button from '../../ui/Button';

interface AlertGatewayProps {
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  handleMarkAllRead: () => void;
}

export default function AlertGateway({ notifications, setNotifications, handleMarkAllRead }: AlertGatewayProps) {
  return (
    <div className="bg-charcoal border border-charcoal-border rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center border-b border-charcoal-border pb-3">
        <span className="text-xs uppercase tracking-widest font-extrabold text-cheese">SYSTEM CONTROL ALERTS CENTER</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
          <Button variant="danger" size="sm" onClick={() => setNotifications([])}>
            Flush Feed
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 font-mono text-cream/20">All clear. No notifications logs.</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-xl border flex items-center justify-between text-xs ${n.read ? 'bg-charcoal-dark border-charcoal-800 text-cream/50' : 'bg-burgundy/20 border-cheese/30 text-white'
              }`}>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-medium uppercase ${n.type === 'Orders' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-400'
                  }`}>{n.type}</span>
                <p className="font-sans font-medium">{n.message}</p>
              </div>
              <span className="text-[10px] font-mono text-cream/40">{n.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
