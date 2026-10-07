import { useState } from 'react';
import { AppHeader } from '@/components/layout';
import { PatientSelector } from '@/components/ui';
import { dataService } from '@/services/dataService';
import { Plus, Phone, MapPin, Shield, Activity, Users, Settings } from 'lucide-react';
import type { Patient } from '@/types';
import { Link } from 'react-router-dom';

const relationshipColors: Record<string, string> = {
  self: 'bg-primary-50 text-primary-600',
  father: 'bg-secondary-50 text-secondary-600',
  mother: 'bg-accent-50 text-accent-600',
  spouse: 'bg-success-50 text-success-600',
  child: 'bg-warning-50 text-warning-600',
  other: 'bg-neutral-100 text-neutral-600',
};

export function FamilyPage() {
  const family = dataService.patients.getAll();
  const [selectedPatientId, setSelectedPatientId] = useState(family[1]?.id ?? family[0].id);

  const selectedPatient = family.find(p => p.id === selectedPatientId);

  // Filtered summaries
  const todaysCare = dataService.care.getTodaysCare().filter(c => c.patientName === selectedPatient?.name);
  const activeServices = dataService.care.getActiveServices().filter(s => s.patientName === selectedPatient?.name);
  const patientRecords = dataService.healthRecords.getAll().filter(r => r.patientName === selectedPatient?.name);
  const activeMeds = patientRecords.filter(r => r.type === 'medication');

  return (
    <div className="pb-24 lg:pb-8">
      <AppHeader title="Family Management" showBack />
      
      <div className="mx-auto max-w-4xl px-4 py-5 lg:px-8">
        
        {/* Context Switcher */}
        <div className="mb-6 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-2/3">
            <PatientSelector
              patients={family}
              selectedId={selectedPatientId}
              onSelect={setSelectedPatientId}
              label="Select family member"
            />
          </div>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100">
            <Plus size={18} /> Add New Profile
          </button>
        </div>

        {selectedPatient && (
          <div className="space-y-6">
            
            {/* Detailed Profile View */}
            <section className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
              <div className="border-b border-neutral-50 p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold capitalize ${relationshipColors[selectedPatient.relationship] ?? relationshipColors.other}`}>
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-neutral-800">{selectedPatient.name}</h2>
                        <span className={`rounded-lg px-2.5 py-0.5 text-xs font-bold capitalize ${relationshipColors[selectedPatient.relationship] ?? relationshipColors.other}`}>
                          {selectedPatient.relationship}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500">
                        <span>{selectedPatient.age} years</span>
                        <span className="capitalize">{selectedPatient.gender}</span>
                        {selectedPatient.bloodGroup && (
                          <span className="font-medium text-error-600">Blood: {selectedPatient.bloodGroup}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-bold text-primary-600">
                    <Settings size={16} /> Edit Profile
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-50 p-6 gap-6">
                
                {/* Contact & Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-neutral-800">Contact Details</h3>
                  <div className="flex items-start gap-3 text-sm text-neutral-600">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-neutral-400" />
                    <span>No. 12, Sahya Apartments, Kaloor, Kochi, Kerala 682017</span>
                  </div>
                  {selectedPatient.emergencyContact && (
                    <div className="flex items-start gap-3 text-sm text-neutral-600">
                      <Phone size={18} className="mt-0.5 shrink-0 text-error-400" />
                      <div>
                        <span className="block font-medium">Emergency Contact</span>
                        <span>{selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.phone})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-neutral-800">Basic Health Info</h3>
                  
                  <div>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Chronic Conditions</span>
                    {selectedPatient.conditions && selectedPatient.conditions.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPatient.conditions.map(c => (
                          <span key={c} className="rounded-lg bg-warning-50 px-2.5 py-1 text-xs font-bold text-warning-700">{c}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-500">None reported</p>
                    )}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Allergies</span>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPatient.allergies.map(a => (
                          <span key={a} className="rounded-lg bg-error-50 px-2.5 py-1 text-xs font-bold text-error-700">{a}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 border border-neutral-100">
                        <p className="text-xs text-neutral-500">No allergies specified. <button className="text-primary-600 font-bold hover:underline">Add allergy</button></p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </section>

            {/* Filtered Data Summary block */}
            <section className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-800">Filtered Dashboard</h3>
                <Link to="/care" className="text-sm font-bold text-primary-600 hover:underline">Go to My Care &rarr;</Link>
              </div>
              <p className="mb-4 text-sm text-neutral-500">All data in the app is now filtered strictly to <strong>{selectedPatient.name}</strong>'s context.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
                  <div className="text-2xl font-bold text-primary-600">{todaysCare.length}</div>
                  <div className="text-xs font-bold text-neutral-500">Today's Care</div>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
                  <div className="text-2xl font-bold text-primary-600">{activeMeds.length}</div>
                  <div className="text-xs font-bold text-neutral-500">Active Medicines</div>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
                  <div className="text-2xl font-bold text-primary-600">{activeServices.length}</div>
                  <div className="text-xs font-bold text-neutral-500">Active Services</div>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-center">
                  <div className="text-2xl font-bold text-primary-600">{patientRecords.length}</div>
                  <div className="text-xs font-bold text-neutral-500">Health Records</div>
                </div>
              </div>
            </section>

            {/* Permission Management */}
            <section className="rounded-3xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-neutral-50 p-6 bg-gradient-to-r from-neutral-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2 shadow-sm border border-neutral-100">
                    <Shield size={24} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-800">Family Access Permissions</h3>
                    <p className="text-sm text-neutral-500">Manage who can view and edit {selectedPatient.name}'s medical records.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-neutral-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        Me
                      </div>
                      <div>
                        <p className="font-bold text-neutral-800">You (Primary Caregiver)</p>
                        <p className="text-xs text-neutral-500">Full access & control</p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500">Owner</span>
                  </div>

                  {/* Placeholder for inviting siblings/spouses */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-6 text-center transition-colors hover:border-primary-200">
                    <Users size={24} className="mb-2 text-neutral-400" />
                    <h4 className="text-sm font-bold text-neutral-700">Invite a family member</h4>
                    <p className="mt-1 max-w-sm text-xs text-neutral-500">
                      Share access with a sibling or spouse so they can coordinate care, book appointments, and view health records for {selectedPatient.name}.
                    </p>
                    <button className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-600 shadow-sm border border-neutral-100 hover:bg-neutral-50">
                      Send Invite Link
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
