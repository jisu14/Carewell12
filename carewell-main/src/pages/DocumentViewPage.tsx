import { useParams } from 'react-router-dom';
import { AppHeader } from '@/components/layout';
import { dataService } from '@/services/dataService';
import { EmptyState } from '@/components/ui';
import { FileText, Download, Share2, Printer, User, Calendar, Stethoscope } from 'lucide-react';

export function DocumentViewPage() {
  const { id } = useParams();
  const record = dataService.healthRecords.getAll().find(r => r.id === id);

  if (!record) {
    return (
      <div className="pb-20 lg:pb-8">
        <AppHeader title="Document" showBack />
        <EmptyState title="Document Not Found" description="This document may have been removed." actionLabel="Back to Records" actionTo="/health-records" />
      </div>
    );
  }

  const isLabReport = record.type === 'lab-report';

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 lg:pb-8">
      <AppHeader title={record.title} showBack />
      
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3 overflow-x-auto pb-2">
          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 border border-neutral-100">
            <Download size={16} className="text-primary-600" /> Download PDF
          </button>
          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 border border-neutral-100">
            <Share2 size={16} className="text-primary-600" /> Share
          </button>
          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 border border-neutral-100">
            <Printer size={16} className="text-primary-600" /> Print
          </button>
        </div>

        {/* The Document "Paper" */}
        <div className="rounded-sm border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between border-b border-neutral-200 pb-6 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{isLabReport ? 'Laboratory Report' : 'Medical Document'}</h1>
              <p className="mt-1 font-medium text-neutral-600">{record.doctor || 'Healthcare Provider'}</p>
            </div>
            <div className="mt-4 text-left sm:mt-0 sm:text-right">
              <p className="text-sm font-medium text-neutral-800">Date: {record.date}</p>
              <p className="mt-1 text-sm text-neutral-500">Record ID: {record.id}</p>
              {record.status && (
                <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider ${
                  record.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-warning-50 text-warning-700'
                }`}>
                  {record.status}
                </span>
              )}
            </div>
          </div>

          {/* Patient Details */}
          <div className="mb-8 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4">
            <div>
              <p className="text-xs font-medium text-neutral-500 flex items-center gap-1"><User size={14}/> Patient Name</p>
              <p className="mt-1 font-semibold text-neutral-800">{record.patientName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500 flex items-center gap-1"><Calendar size={14}/> Tested On</p>
              <p className="mt-1 font-semibold text-neutral-800">{record.date}</p>
            </div>
          </div>

          {/* Document Content */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-neutral-800">{record.title}</h2>
            <div className="prose prose-sm max-w-none text-neutral-700">
              <p className="whitespace-pre-wrap">{record.details}</p>
            </div>
          </div>

          {/* Lab Report specifics mock table */}
          {isLabReport && (
            <div className="mb-8 overflow-x-auto">
              <table className="w-full min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="py-3 px-4 font-semibold text-neutral-700">Test Parameter</th>
                    <th className="py-3 px-4 font-semibold text-neutral-700">Result</th>
                    <th className="py-3 px-4 font-semibold text-neutral-700">Reference Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4">Sample Parameter 1</td>
                    <td className="py-3 px-4 font-medium text-neutral-800">14.5</td>
                    <td className="py-3 px-4 text-neutral-500">12.0 - 16.0</td>
                  </tr>
                  <tr className="border-b border-neutral-100">
                    <td className="py-3 px-4">Sample Parameter 2</td>
                    <td className="py-3 px-4 font-medium text-emerald-600">Negative</td>
                    <td className="py-3 px-4 text-neutral-500">Negative</td>
                  </tr>
                  <tr className="border-b border-neutral-100 bg-warning-50">
                    <td className="py-3 px-4">Sample Parameter 3</td>
                    <td className="py-3 px-4 font-bold text-warning-700">240 ↑</td>
                    <td className="py-3 px-4 text-neutral-500">&lt; 200</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-2 text-xs text-neutral-400 italic">This is a digitally verified mock report. Not for medical diagnosis.</p>
            </div>
          )}

          {/* Attachments (reusable architecture) */}
          {record.attachments && record.attachments.length > 0 && (
            <div className="mt-8 border-t border-neutral-200 pt-6">
              <h3 className="mb-3 font-semibold text-neutral-800 flex items-center gap-2">
                <FileText size={18} className="text-primary-600" /> Attached Documents
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {record.attachments.map((file: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50 cursor-pointer">
                    <div className="rounded bg-primary-100 p-2 text-primary-600">
                      <FileText size={16} />
                    </div>
                    <span className="truncate font-medium text-neutral-700">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer signature */}
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div className="mb-2 text-emerald-600">
                <Stethoscope size={24} className="mx-auto" />
              </div>
              <p className="font-semibold text-neutral-800">{record.doctor}</p>
              <p className="text-xs text-neutral-500">Electronically Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
