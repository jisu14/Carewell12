import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { FileText, Save, CheckCircle } from 'lucide-react';
import type { HealthRecord } from '@/types';

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export function DoctorPrescriptionPage() {
  const { id } = useParams(); // mock order id
  const navigate = useNavigate();
  const order = dataService.orders.getById(id || '');

  const doctorName = order?.title.replace('Consultation with ', '') || 'Doctor';

  const [diagnosis, setDiagnosis] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [isSaved, setIsSaved] = useState(false);
  const [generatedRecordId, setGeneratedRecordId] = useState('');

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const recordId = `rec-${Date.now()}`;
    const newRecord: HealthRecord = {
      id: recordId,
      type: 'prescription',
      title: `Prescription from ${doctorName}`,
      date: new Date().toISOString().split('T')[0],
      doctor: doctorName,
      patientName: 'Self', // mock patient
      details: diagnosis,
      medicines,
      followUp,
    };
    
    dataService.healthRecords.addRecord(newRecord);
    setGeneratedRecordId(recordId);
    setIsSaved(true);
  };

  if (isSaved) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="mb-6 rounded-full bg-emerald-100 p-6 text-emerald-600 shadow-sm animate-in zoom-in">
          <CheckCircle size={64} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">Prescription Saved!</h1>
        <p className="mb-8 max-w-sm text-neutral-500">
          The prescription has been generated and securely saved to the patient's Health Records.
        </p>
        <button 
          onClick={() => navigate(`/prescription-view/${generatedRecordId}`)}
          className="rounded-2xl bg-primary-600 px-8 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          View as Patient
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title="Issue Prescription" showBack />
      
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-primary-50 p-4 border border-primary-100">
          <p className="text-sm font-semibold text-primary-800">Doctor Mode Enabled</p>
          <p className="text-xs text-primary-600 mt-1">
            IMPORTANT: This is a demo interface. Do not allow AI to prescribe medicines. Prescriptions must originate from the doctor.
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          {/* Diagnosis */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-neutral-700">Diagnosis / Clinical Impression</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="E.g., Acute viral pharyngitis"
              rows={3}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Medicines */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-semibold text-neutral-700">Medicines</label>
              <button 
                onClick={handleAddMedicine}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                + Add Medicine
              </button>
            </div>
            
            <div className="space-y-4">
              {medicines.map((med, index) => (
                <div key={index} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 relative">
                  {medicines.length > 1 && (
                    <button 
                      onClick={() => handleRemoveMedicine(index)}
                      className="absolute right-4 top-4 text-xs font-medium text-error-500 hover:text-error-600"
                    >
                      Remove
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Medicine Name</label>
                      <input 
                        type="text" 
                        value={med.name}
                        onChange={e => handleMedicineChange(index, 'name', e.target.value)}
                        placeholder="E.g., Paracetamol 500mg"
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Dosage</label>
                      <input 
                        type="text" 
                        value={med.dosage}
                        onChange={e => handleMedicineChange(index, 'dosage', e.target.value)}
                        placeholder="E.g., 1 Tablet"
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Frequency</label>
                      <input 
                        type="text" 
                        value={med.frequency}
                        onChange={e => handleMedicineChange(index, 'frequency', e.target.value)}
                        placeholder="E.g., Twice a day (1-0-1)"
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Duration</label>
                      <input 
                        type="text" 
                        value={med.duration}
                        onChange={e => handleMedicineChange(index, 'duration', e.target.value)}
                        placeholder="E.g., 5 Days"
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-neutral-500">Instructions</label>
                      <input 
                        type="text" 
                        value={med.instructions}
                        onChange={e => handleMedicineChange(index, 'instructions', e.target.value)}
                        placeholder="E.g., After food"
                        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-semibold text-neutral-700">Follow-up Date</label>
            <input 
              type="date"
              value={followUp}
              onChange={e => setFollowUp(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={!diagnosis || !medicines[0].name}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-bold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
          >
            <Save size={18} />
            Save & Generate Digital Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
