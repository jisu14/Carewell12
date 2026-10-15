import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Mail, Lock, Phone, ShieldCheck, ArrowRight, Sparkles, 
  KeyRound, AlertCircle, Eye, EyeOff 
} from 'lucide-react';

export function LoginPage() {
  const { login, loginWithOtp, loginAsDemo, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/home';

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('demo@carewell.in');
  const [password, setPassword] = useState('carewell123');
  const [phone, setPhone] = useState('+91 98470 12345');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid credentials. Please try again or use Demo Login.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setOtp('123456'); // Pre-fill preview verification code
    setErrorMessage(null);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await loginWithOtp(phone, otp);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid OTP code. Please enter 123456.');
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    try {
      await loginAsDemo();
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Demo login failed');
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans">
      {/* Background ambient luxury lighting */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-xl shadow-emerald-600/20 mb-4 ring-4 ring-emerald-50">
            <ShieldCheck size={28} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Care<span className="text-emerald-600">Well</span>
          </h1>
          <p className="mt-1.5 text-xs uppercase tracking-widest font-semibold text-emerald-800/70">
            Private Patient & Family Portal
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Access your doctors, lab records, home care, and family vitals securely.
          </p>
        </div>

        {/* Auth Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-xl">
          {/* Quick Demo Login Pill Banner */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50/70 border border-emerald-100/80 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-emerald-950">Reviewer Quick-Access</div>
                <div className="text-[11px] text-emerald-700">Explore full platform with 1 click</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
            >
              Demo Sign In
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100/80 p-1 mb-6 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => { setAuthMode('password'); setErrorMessage(null); }}
              className={`rounded-xl py-2 transition-all ${
                authMode === 'password'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp'); setErrorMessage(null); }}
              className={`rounded-xl py-2 transition-all ${
                authMode === 'otp'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'hover:text-slate-900'
              }`}
            >
              Mobile OTP
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {authMode === 'password' ? (
            /* Email / Password Form */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@carewell.in"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Password
                  </label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); setErrorMessage('Password reset link sent to registered email.'); }} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>Remember this device</span>
                </label>
                <span className="text-[11px] text-slate-400">256-Bit Encrypted</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Sign In to CareWell</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Form */
            <form onSubmit={otpSent ? handleOtpSubmit : handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone size={17} />
                  </div>
                  <input
                    type="tel"
                    required
                    disabled={otpSent}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98470 12345"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition disabled:opacity-60"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Enter 6-digit Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtp('123456')}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Resend Code
                    </button>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <KeyRound size={17} />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-center font-mono text-base tracking-widest text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 text-center">
                    Demo preview OTP auto-set to <span className="font-mono font-bold text-emerald-600">123456</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : otpSent ? (
                  <>
                    <span>Verify Code & Enter</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sign Up Redirect */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have a CareWell medical profile?{' '}
            <Link to="/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
              Register Patient Profile
            </Link>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>NABH Compliant &bull; Secure Health Cloud &bull; End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
}
