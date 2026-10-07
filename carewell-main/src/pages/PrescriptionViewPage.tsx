import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { FileText, Calendar, User, Sparkles } from 'lucide-react';

export function PrescriptionViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const record = dataService.healthRecords.getAll().find(r => r.id === id);

  if (!record || record.type !== 'prescription') {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Prescription" showBack />
        <EmptyState title="Record not found" description="This prescription is unavailable" actionLabel="Go to Records" actionTo="/health-records" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title="Prescription Details" showBack />
      
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        
        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between border-b border-neutral-100 pb-5 mb-5">
            <div>
              <h2 className="text-xl font-bold text-neutral-800">{record.doctor}</h2>
              <p className="text-sm text-neutral-500">{record.title}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <FileText size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="font-medium text-neutral-500 flex items-center gap-1.5"><User size={14} /> Patient</p>
              <p className="mt-1 font-semibold text-neutral-800">{record.patientName}</p>
            </div>
            <div>
              <p className="font-medium text-neutral-500 flex items-center gap-1.5"><Calendar size={14} /> Date</p>
              <p className="mt-1 font-semibold text-neutral-800">{record.date}</p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Diagnosis / Clinical Impression</h3>
            <p className="text-sm font-medium text-neutral-800">{record.details}</p>
          </div>

          {record.medicines && record.medicines.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Prescribed Medicines</h3>
              <div className="space-y-3">
                {record.medicines.map((med, idx) => (
                  <div key={idx} className="flex flex-col rounded-2xl border border-neutral-100 p-4">
                    <p className="font-bold text-neutral-800">{med.name}</p>
                    <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
                      <p><span className="text-neutral-500">Dosage:</span> {med.dosage}</p>
                      <p><span className="text-neutral-500">Frequency:</span> {med.frequency}</p>
                      <p><span className="text-neutral-500">Duration:</span> {med.duration}</p>
                    </div>
                    {med.instructions && (
                      <p className="mt-2 rounded-lg bg-warning-50 px-3 py-2 text-xs font-medium text-warning-800">
                        Instructions: {med.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {record.followUp && (
            <div className="border-t border-neutral-100 pt-4 mt-2">
              <p className="text-sm font-medium text-neutral-700">
                <span className="text-neutral-500">Follow-up advised on:</span> {record.followUp}
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={() => navigate(`/prescription-cart/${record.id}`)}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 font-bold text-white shadow-lg shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-xl active:scale-[0.98]"
        >
          <Sparkles size={20} className="group-hover:animate-pulse" />
          Ask Heera to Get Medicines
        </button>

      </div>
    </div>
  );
}
