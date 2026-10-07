import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { PatientSelector } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Pill, Clock, AlertTriangle, Calendar, FileText, ShoppingBag, ShieldAlert, History } from 'lucide-react';

// Architecture preparation for real notification service
const reminderSchedule = [
  { id: 'rem1', time: '08:00 AM', label: 'Morning', active: true, meds: ['Metformin 500mg', 'Amlodipine 5mg'] },
  { id: 'rem2', time: '01:00 PM', label: 'Afternoon', active: false, meds: [] },
  { id: 'rem3', time: '08:00 PM', label: 'Evening', active: true, meds: ['Metformin 500mg'] },
  { id: 'rem4', time: '10:00 PM', label: 'Bedtime', active: true, meds: ['Atorvastatin 10mg'] },
];

export function MedicationsPage() {
  const allPatients = dataService.patients.getAll();
  const [selectedPatientId, setSelectedPatientId] = useState(allPatients[1]?.id ?? allPatients[0].id);

  const selectedPatient = allPatients.find((p) => p.id === selectedPatientId);

  const allMeds = dataService.medications.getAll();
  const patientMeds = allMeds.filter(m => m.patientName === selectedPatient?.name);
  const activeMeds = patientMeds.filter(m => m.status === 'active');
  const historyMeds = patientMeds.filter(m => m.status === 'history');

  const handleReminderToggle = (id: string) => {
    // Placeholder for native push notification registration/deregistration logic
    console.log(`Toggling reminder ${id} in notification service...`);
  };

  return (
    <div className="pb-24 lg:pb-8">
      <AppHeader title="Medications" showBack />
      <div className="mx-auto max-w-6xl px-4 py-5 lg:px-8">
        
        {/* Safety Warning */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-warning-50 p-4 border border-warning-100 shadow-sm">
          <ShieldAlert className="mt-0.5 shrink-0 text-warning-600" size={20} />
          <div>
            <h4 className="text-sm font-bold text-warning-800">Medical Safety Notice</h4>
            <p className="mt-1 text-xs text-warning-700">
              Do not alter your prescribed dosage without consulting your doctor. Information shown here originates from your authorized prescriptions and health records.
            </p>
          </div>
        </div>

        {/* Patient selector */}
        <div className="mb-6 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
          <PatientSelector
            patients={allPatients}
            selectedId={selectedPatientId}
            onSelect={setSelectedPatientId}
            label="Managing medications for"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          
          <div className="space-y-6 lg:col-span-8">
            {/* Current Medicines */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-800">
                  <Pill size={20} className="text-primary-500" /> Current Medicines
                </h2>
              </div>
              
              <div className="space-y-4">
                {activeMeds.length > 0 ? activeMeds.map(med => (
                  <div key={med.id} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:border-primary-200">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-neutral-800">{med.name}</h3>
                            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-bold text-neutral-600">{med.strength}</span>
                          </div>
                          <p className="mt-1 font-medium text-primary-700">{med.dosage} • {med.frequency}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-3 text-xs">
                        <div>
                          <span className="block text-neutral-400">Duration</span>
                          <span className="font-medium text-neutral-700">
                            {new Date(med.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(med.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="block text-neutral-400">Prescribed by</span>
                          <span className="font-medium text-neutral-700">{med.prescribingDoctor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Refill Prediction */}
                    <div className={`border-t px-4 py-3 flex items-center justify-between ${med.remainingDays <= 7 ? 'bg-warning-50 border-warning-100' : 'bg-white border-neutral-50'}`}>
                      <div className="flex items-center gap-2">
                        {med.remainingDays <= 7 ? (
                          <AlertTriangle size={16} className="text-warning-600" />
                        ) : (
                          <ShoppingBag size={16} className="text-success-600" />
                        )}
                        <span className={`text-sm font-medium ${med.remainingDays <= 7 ? 'text-warning-800' : 'text-neutral-600'}`}>
                          You may need a refill in {med.remainingDays} days
                        </span>
                      </div>
                      {med.remainingDays <= 14 && (
                        <Link to="/pharmacies" className="shrink-0 rounded-xl bg-primary-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary-700">
                          Order Again
                        </Link>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center">
                    <Pill size={32} className="mx-auto mb-3 text-neutral-300" />
                    <p className="text-sm font-medium text-neutral-500">No active medicines found for {selectedPatient?.name}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Medication History */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-800">
                  <History size={20} className="text-primary-500" /> Medication History
                </h2>
              </div>
              
              <div className="rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm">
                <div className="space-y-4">
                  {historyMeds.length > 0 ? historyMeds.map(med => (
                    <div key={med.id} className="flex items-start justify-between border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-bold text-neutral-700">{med.name} <span className="font-normal text-neutral-500">{med.strength}</span></h3>
                        <p className="text-xs text-neutral-500">Prescribed by {med.prescribingDoctor}</p>
                        <p className="mt-1 text-xs text-neutral-400">
                          {new Date(med.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} - {new Date(med.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <Link to="/pharmacies" className="text-xs font-bold text-primary-600">Reorder</Link>
                    </div>
                  )) : (
                    <p className="py-4 text-center text-sm text-neutral-400">No past medications recorded.</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Reminders */}
          <div className="lg:col-span-4">
            <section className="sticky top-24">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-800">
                  <Clock size={20} className="text-primary-500" /> Daily Reminders
                </h2>
                <button className="text-xs font-bold text-primary-600">+ Custom</button>
              </div>
              
              <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm">
                <div className="space-y-5">
                  {reminderSchedule.map(rem => (
                    <div key={rem.id} className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-lg bg-neutral-50 p-2 border border-neutral-100">
                          <Clock size={16} className={rem.active ? 'text-primary-600' : 'text-neutral-400'} />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-800">{rem.label} <span className="ml-1 text-xs font-normal text-neutral-500">{rem.time}</span></p>
                          {rem.meds.length > 0 ? (
                            <p className="mt-1 text-xs text-primary-700 font-medium line-clamp-2">
                              {rem.meds.join(', ')}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-neutral-400">No medicines</p>
                          )}
                        </div>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input 
                          type="checkbox" 
                          className="peer sr-only" 
                          defaultChecked={rem.active}
                          onChange={() => handleReminderToggle(rem.id)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-neutral-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-primary-800"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 rounded-2xl bg-primary-50 p-4 border border-primary-100">
                <h4 className="text-sm font-bold text-primary-800">Notification Sync</h4>
                <p className="mt-1 text-xs text-primary-700">
                  CareWell automatically syncs reminders with your phone's notification center.
                </p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
