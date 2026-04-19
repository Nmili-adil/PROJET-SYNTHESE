import React, { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClientContext } from "../../../api/context/ClientContext";
import { ALLPRODUCTS, REGISTERSTORE } from "../../router/paths";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, setClient, authenticated } = useClientContext();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (authenticated) navigate(ALLPRODUCTS);
  }, [authenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login(formData);
      if (response?.data) {
        setClient(response.data);
        navigate(ALLPRODUCTS);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex">
      {/* Left Panel — Brand */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center px-16"
        style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1060 50%, #552583 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-secondary/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/5 translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full border border-white/5 -translate-x-1/2 -translate-y-1/2" />

        <div className={`relative z-10 text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-4">Kinetic Court</p>
          <h1 className="text-5xl font-headline font-black uppercase tracking-tighter text-white leading-none mb-6">
            The Court<br />
            <span className="text-secondary">Awaits</span>
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            Sign in to access exclusive merchandise, track your orders, and join the dynasty.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            {[['10K+', 'Members'], ['500+', 'Products'], ['24/7', 'Support']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-headline font-black text-secondary">{val}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <img
              src="/images/lebronjames3.jpeg"
              alt="Basketball"
              className="w-56 h-56 object-cover mx-auto"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-surface">
        <div className={`w-full max-w-md transition-all duration-700 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10">
            <p className="text-xs text-secondary uppercase tracking-widest font-semibold mb-2">Welcome back</p>
            <h2 className="text-3xl font-headline font-black uppercase tracking-tighter">Sign In</h2>
            <p className="text-on-surface-variant text-sm mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant block mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary transition-colors disabled:opacity-50 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary transition-colors disabled:opacity-50 text-sm pr-12"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-900/20 border border-red-400/30">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3.5 bg-secondary text-on-secondary font-bold uppercase tracking-widest text-sm hover:bg-secondary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-on-secondary/30 border-t-on-secondary rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant text-center">
            <p className="text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate(REGISTERSTORE)}
                disabled={loading}
                className="text-secondary hover:text-secondary-container font-semibold transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
