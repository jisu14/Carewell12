import { useState } from 'react';
import { AppHeader } from '@/components/layout';
import { OrderCard, EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import type { OrderType } from '@/types';
import { Package } from 'lucide-react';

const tabs: { label: string; value: OrderType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Home Care', value: 'home-care' },
  { label: 'Doctors', value: 'doctor' },
  { label: 'Medicines', value: 'medicine' },
  { label: 'Lab Tests', value: 'lab' },
  { label: 'Equipment', value: 'equipment' },
];

export function OrdersPage() {
  const allOrders = dataService.orders.getAll();
  const [activeTab, setActiveTab] = useState<OrderType | 'all'>('all');

  const filteredOrders = activeTab === 'all' ? allOrders : allOrders.filter((o) => o.type === activeTab);

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Orders" />
      <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
        {/* Tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.value ? 'bg-primary-600 text-white' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredOrders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
          <EmptyState icon={<Package size={28} />} title="No orders found" description="Your orders will appear here" actionLabel="Explore Services" actionTo="/explore" />
        )}
      </div>
    </div>
  );
}
