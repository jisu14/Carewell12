import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import {
  User, Users, MapPin, CreditCard, Bell, Shield, Lock,
  HelpCircle, Info, LogOut, ChevronRight, Heart, FileText,
} from 'lucide-react';

export function ProfilePage() {
  const user = dataService.user.getCurrent();
  const family = dataService.patients.getAll();
  const addresses = dataService.addresses.getAll();
  const paymentMethods = dataService.paymentMethods.getAll();

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
        { icon: <User size={20} />, label: 'Personal Details', value: user.name },
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
        <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800">{user.name}</h2>
            <p className="text-sm text-neutral-400">{user.phone}</p>
            <p className="text-sm text-neutral-400">{user.email}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-400">
              <MapPin size={12} /> {user.location}
            </p>
          </div>
        </div>

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

        {/* Logout */}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-4 text-sm font-semibold text-error-600 transition-colors hover:bg-error-50">
          <LogOut size={18} />
          Logout
        </button>

        <p className="mt-6 text-center text-xs text-neutral-300">CareWell v0.1.0 — Skeleton</p>
        <p className="text-center text-xs text-neutral-300">HLT Pvt Ltd</p>
      </div>
    </div>
  );
}
