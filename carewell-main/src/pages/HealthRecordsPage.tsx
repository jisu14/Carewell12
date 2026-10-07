import { useState } from 'react';
import { AppHeader } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import type { HealthRecord } from '@/types';
import { Link } from 'react-router-dom';
import { FileText, FlaskConical, Stethoscope, Pill, FileEdit, Syringe, ClipboardList, Download, Share2, ChevronRight } from 'lucide-react';

const recordTypeConfig: Record<HealthRecord['type'], { icon: React.ReactNode; label: string; color: string }> = {
  prescription: { icon: <FileText size={18} />, label: 'Prescriptions', color: 'bg-primary-50 text-primary-600' },
  'lab-report': { icon: <FlaskConical size={18} />, label: 'Lab Reports', color: 'bg-secondary-50 text-secondary-600' },
  consultation: { icon: <Stethoscope size={18} />, label: 'Consultations', color: 'bg-accent-50 text-accent-600' },
  document: { icon: <FileEdit size={18} />, label: 'Documents', color: 'bg-neutral-100 text-neutral-600' },
  medication: { icon: <Pill size={18} />, label: 'Medications', color: 'bg-success-50 text-success-600' },
  diagnosis: { icon: <ClipboardList size={18} />, label: 'Diagnoses', color: 'bg-warning-50 text-warning-600' },
  vaccination: { icon: <Syringe size={18} />, label: 'Vaccinations', color: 'bg-secondary-50 text-secondary-600' },
  other: { icon: <FileText size={18} />, label: 'Other', color: 'bg-neutral-100 text-neutral-600' },
};

const tabs = ['all', 'prescription', 'lab-report', 'consultation', 'document', 'medication', 'diagnosis', 'vaccination'] as const;

export function HealthRecordsPage() {
  const records = dataService.healthRecords.getAll();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('all');

  const filtered = activeTab === 'all' ? records : records.filter((r) => r.type === activeTab);

  return (
    <div className="pb-20 lg:pb-8">
      <AppHeader title="Health Records" showBack />
      <div className="mx-auto max-w-6xl px-4 py-4 lg:px-8">
        {/* Tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-primary-600 text-white' : 'border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300'}`}
            >
              {tab === 'all' ? 'All' : recordTypeConfig[tab as HealthRecord['type']]?.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((record) => {
              const config = recordTypeConfig[record.type];
              return (
                <div key={record.id} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-card transition-all hover:border-primary-200 hover:shadow-card-hover">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-semibold text-neutral-800">{record.title}</h4>
                      <p className="text-xs text-neutral-400">{new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-neutral-500 line-clamp-2">{record.details}</p>
                  {record.doctor && <p className="mt-1 text-xs text-neutral-400">{record.doctor}</p>}
                  <p className="mt-1 text-xs text-neutral-400">Patient: {record.patientName}</p>
                  <div className="mt-3 flex items-center gap-2 border-t border-neutral-50 pt-3">
                    {record.type === 'prescription' ? (
                      <Link 
                        to={`/prescription-view/${record.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        <FileText size={14} /> View Details
                      </Link>
                    ) : (
                      <Link 
                        to={`/health-records/${record.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        <FileText size={14} /> View Details
                      </Link>
                    )}
                    <span className="text-neutral-200">|</span>
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700">
                      <Download size={14} /> Download
                    </button>
                    <span className="text-neutral-200">|</span>
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700">
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={<FileText size={28} />} title="No records found" description="Health records will appear here as they are added" />
        )}
      </div>
    </div>
  );
}
