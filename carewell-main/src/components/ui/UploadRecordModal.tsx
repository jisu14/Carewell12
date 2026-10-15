import { useState, useRef } from 'react';
import { 
  X, UploadCloud, FileText, CheckCircle2, 
  User, Calendar, Stethoscope, Sparkles, File, Trash2 
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import type { HealthRecord } from '@/types';

export function UploadRecordModal({
  isOpen,
  onClose,
  onRecordAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRecordAdded: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patients = dataService.patients.getAll();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<HealthRecord['type']>('prescription');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [doctor, setDoctor] = useState('');
  const [details, setDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const selectedPatient = patients.find((p) => p.id === patientId);

    const newRecord: HealthRecord = {
      id: `rec-${Date.now()}`,
      patientId: patientId || 'p1',
      patientName: selectedPatient?.name || 'Self',
      title: title.trim(),
      type,
      date: new Date().toISOString(),
      doctor: doctor.trim() || undefined,
      details: details.trim() || `Uploaded document: ${selectedFile?.name || 'Clinical report'}`,
    };

    dataService.healthRecords.addRecord(newRecord);
    setSaving(false);
    onRecordAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Medical Document</h3>
              <p className="text-[11px] text-slate-500">Add prescription, lab report, or discharge summary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          {/* File Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 p-5 text-center transition group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,image/*"
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <File size={20} />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-bold text-slate-800 text-xs truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs text-slate-400 group-hover:text-emerald-600 transition">
                  <UploadCloud size={20} />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Click to select file or drag & drop
                </p>
                <p className="text-[11px] text-slate-400">PDF, JPG, or PNG up to 25 MB</p>
              </div>
            )}
          </div>

          {/* Record Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Hemogram & Lipid Profile"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>

          {/* Category & Patient Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Record Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="prescription">Prescription</option>
                <option value="lab-report">Lab Report</option>
                <option value="consultation">Consultation Summary</option>
                <option value="document">Discharge Summary</option>
                <option value="vaccination">Vaccination Record</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Patient Member
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 bg-white"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.relationship})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prescribing Doctor or Clinic */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Doctor or Clinic (Optional)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Stethoscope size={15} />
              </div>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="e.g. Dr. Ramesh Menon / Aster Medcity"
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Clinical Findings / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Fasting blood sugar 98 mg/dL, normal sinus rhythm"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Save to Encrypted Health Vault</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
