import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function AdminLogin({ onLoginSuccess, onBackToStore }: { onLoginSuccess: (token: string) => void, onBackToStore: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token } = response.data;
      onLoginSuccess(token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-gray flex items-center justify-center p-4">
      <div className="bg-charcoal-black border border-charcoal-border rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h2 className="text-xl font-medium text-white mt-4 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="text-cheese w-6 h-6" />
            Admin Portal
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-cream/80 uppercase mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-charcoal-gray border border-charcoal-border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-cheese"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-cream/80 uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-charcoal-gray border border-charcoal-border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-cheese"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cheese hover:bg-yellow-400 text-black font-medium uppercase tracking-widest py-3 rounded-lg transition-colors mt-2"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
          <button
            type="button"
            onClick={onBackToStore}
            className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-cream/80 font-medium uppercase tracking-widest py-3 rounded-lg transition-colors mt-2 text-xs"
          >
            Return to Store
          </button>
        </form>
      </div>
    </div>
  );
}
