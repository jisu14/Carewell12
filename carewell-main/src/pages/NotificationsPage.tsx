import { useState } from 'react';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import type { Notification } from '@/types';
import {
  Calendar, Package, Pill, Heart, FlaskConical,
  CreditCard, Info, Bell,
} from 'lucide-react';

const categoryConfig: Record<Notification['category'], { icon: React.ReactNode; label: string; color: string }> = {
  appointments: { icon: <Calendar size={18} />, label: 'Appointments', color: 'bg-secondary-50 text-secondary-600' },
  orders: { icon: <Package size={18} />, label: 'Orders', color: 'bg-primary-50 text-primary-600' },
  medicines: { icon: <Pill size={18} />, label: 'Medicines', color: 'bg-success-50 text-success-600' },
  care: { icon: <Heart size={18} />, label: 'Care', color: 'bg-accent-50 text-accent-600' },
  'lab-reports': { icon: <FlaskConical size={18} />, label: 'Lab Reports', color: 'bg-secondary-50 text-secondary-600' },
  payments: { icon: <CreditCard size={18} />, label: 'Payments', color: 'bg-warning-50 text-warning-600' },
  system: { icon: <Info size={18} />, label: 'System', color: 'bg-neutral-100 text-neutral-600' },
};

const tabs: (Notification['category'] | 'all')[] = ['all', 'appointments', 'orders', 'medicines', 'care', 'lab-reports', 'payments', 'system'];

export function NotificationsPage() {
  const allNotifications = dataService.notifications.getAll();
  const [activeTab, setActiveTab] = useState<Notification['category'] | 'all'>('all');

  const filtered = activeTab === 'all' ? allNotifications : allNotifications.filter((n) => n.category === activeTab);

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Notifications" showBack />
      <div className="mx-auto max-w-3xl px-4 py-4 lg:px-8">
        {/* Tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-primary-600 text-white' : 'border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'}`}
            >
              {tab === 'all' ? 'All' : categoryConfig[tab].label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((notif) => {
              const config = categoryConfig[notif.category];
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${notif.read ? 'border-neutral-100 bg-white' : 'border-primary-100 bg-primary-50/30'}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-neutral-800">{notif.title}</h4>
                      {!notif.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">{notif.message}</p>
                    <p className="mt-1 text-xs text-neutral-400">{notif.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <Bell size={28} />
            </div>
            <h3 className="text-base font-semibold text-neutral-700">No notifications</h3>
            <p className="mt-1 text-sm text-neutral-400">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
