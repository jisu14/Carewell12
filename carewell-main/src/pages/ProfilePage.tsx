import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/context/AuthContext';
import {
  User, Users, MapPin, CreditCard, Bell, Shield, Lock,
  HelpCircle, Info, LogOut, ChevronRight, Heart, FileText,
  LogIn, CheckCircle2,
} from 'lucide-react';

export function ProfilePage() {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Fallback to dataService if authUser is null
  const defaultUser = dataService.user.getCurrent();
  const user = authUser || defaultUser;

  const family = dataService.patients.getAll();
  const addresses = dataService.addresses.getAll();
  const paymentMethods = dataService.paymentMethods.getAll();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  interface SectionItem {
    icon: JSX.Element;
    label: string;
    value?: string;
    to?: string;
  }

  const sections: { title: string; items: SectionItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: <User size={20} />, label: 'Personal Details', value: user?.name },
        { icon: <Users size={20} />, label: 'Family Members', value: `${family.length} members`, to: '/family' },
        { icon: <MapPin size={20} />, label: 'Addresses', value: `${addresses.length} saved` },
        { icon: <CreditCard size={20} />, label: 'Payment Methods', value: `${paymentMethods.length} saved` },
      ],
    },
    {
      title: 'Health',
      items: [
        { icon: <Heart size={20} />, label: 'My Care', to: '/care' },
        { icon: <FileText size={20} />, label: 'Health Records', to: '/health-records' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Bell size={20} />, label: 'Notifications', to: '/notifications' },
        { icon: <Shield size={20} />, label: 'Privacy' },
        { icon: <Lock size={20} />, label: 'Security' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: <HelpCircle size={20} />, label: 'Help & Support' },
        { icon: <Info size={20} />, label: 'About' },
      ],
    },
  ];

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Profile" />
      <div className="mx-auto max-w-3xl px-4 py-5 lg:px-8">
        {/* User card */}
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-2xl font-black text-white shadow-md shadow-emerald-600/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-neutral-800">{user.name}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
                <p className="text-sm text-neutral-500">{user.phone}</p>
                <p className="text-xs text-neutral-400">{user.email}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin size={12} className="text-emerald-600" /> {user.location}
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="hidden sm:inline-flex rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Switch Account
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-5 shadow-card">
            <div>
              <h2 className="text-base font-bold text-emerald-950">Not Signed In</h2>
              <p className="text-xs text-emerald-800/80">Sign in to sync appointments, prescriptions, and health records.</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              <LogIn size={15} />
              Sign In Now
            </Link>
          </div>
        )}

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} className="mt-6">
            <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">{section.title}</h3>
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-card">
              {section.items.map((item, i) => {
                const content = (
                  <div className={`flex items-center gap-3 px-4 py-3.5 ${i !== section.items.length - 1 ? 'border-b border-neutral-50' : ''}`}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700">{item.label}</p>
                      {item.value && <p className="text-xs text-neutral-400">{item.value}</p>}
                    </div>
                    <ChevronRight size={18} className="text-neutral-300" />
                  </div>
                );
                return item.to ? (
                  <Link key={item.label} to={item.to}>{content}</Link>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout or Login Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-4 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50 active:scale-[0.99] disabled:opacity-50"
          >
            {loggingOut ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <>
                <LogOut size={18} />
                <span>Log Out of CareWell</span>
              </>
            )}
          </button>
        ) : (
          <Link
            to="/login"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700"
          >
            <LogIn size={18} />
            <span>Sign In to Access CareWell</span>
          </Link>
        )}

        <p className="mt-6 text-center text-xs text-neutral-400">CareWell Platform &bull; Patient Care Suite v2.4</p>
        <p className="text-center text-xs text-neutral-400">HLT Private Healthcare Network</p>
      </div>
    </div>
  );
}
