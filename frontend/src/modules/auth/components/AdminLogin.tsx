import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import Logo from "../../../shared/components/ui/Logo";
import { adminLogin } from "../../../services/api";

export default function AdminLogin({
  onLoginSuccess,
  onBackToStore,
}: {
  onLoginSuccess: (token: string) => void;
  onBackToStore: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Backend expects { username, password } where username is used as email lookup
      const response = await adminLogin({ username: email, password });
      const { token } = response.data;
      onLoginSuccess(token);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      if (msg === "Invalid credentials") {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.data?.errors) {
        // Zod validation errors
        setError(
          err.response.data.errors.map((e: any) => e.message).join(", "),
        );
      } else {
        setError(msg);
      }
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
            <label
              htmlFor="admin-email"
              className="block text-xs font-medium text-cream/90 uppercase mb-1"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-charcoal-gray border border-charcoal-border rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-cheese"
              placeholder="admin@pizzaxpert.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-cream/90 uppercase mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal-gray border border-charcoal-border rounded-lg py-2.5 px-4 pr-12 text-white focus:outline-none focus:border-cheese"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-cheese transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cheese hover:bg-yellow-400 text-black font-medium uppercase tracking-widest py-3 rounded-lg transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Secure Login"}
          </button>
          <button
            type="button"
            onClick={onBackToStore}
            className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-cream/90 font-medium uppercase tracking-widest py-3 rounded-lg transition-colors mt-2 text-xs"
          >
            Return to Store
          </button>
        </form>
      </div>
    </div>
  );
}
