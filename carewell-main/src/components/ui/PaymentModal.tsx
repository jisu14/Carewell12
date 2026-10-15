import { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, CreditCard, 
  Smartphone, Building2, Banknote, Download, 
  ArrowRight, Sparkles, Printer, QrCode
} from 'lucide-react';
import { dataService } from '@/services/dataService';

export interface PaymentDetails {
  bookingId: string;
  title: string;
  serviceType: 'doctor' | 'home-care' | 'lab' | 'equipment';
  patientName: string;
  amount: number;
  date?: string;
  timeSlot?: string;
  providerName?: string;
  onSuccess: (receipt: PaymentReceipt) => void;
  onClose: () => void;
}

export interface PaymentReceipt {
  receiptId: string;
  bookingId: string;
  transactionRef: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  method: string;
  paidAt: string;
  patientName: string;
  serviceName: string;
  providerName: string;
}

export function PaymentModal({
  isOpen,
  details,
}: {
  isOpen: boolean;
  details: PaymentDetails | null;
}) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReceipt(null);
      setProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !details) return null;

  const baseAmount = details.amount;
  const taxAmount = Math.round(baseAmount * 0.05); // 5% Healthcare GST / Cess
  const totalAmount = baseAmount + taxAmount;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const generatedReceipt: PaymentReceipt = {
        receiptId: `CW-INV-${Math.floor(100000 + Math.random() * 900000)}`,
        bookingId: details.bookingId,
        transactionRef: `TXN-${Date.now().toString(36).toUpperCase()}`,
        amount: baseAmount,
        taxAmount,
        totalAmount,
        method: method === 'upi' ? 'UPI (Instant QR)' : method === 'card' ? 'Credit/Debit Card' : method === 'netbanking' ? 'Net Banking' : 'Pay After Care Visit',
        paidAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        patientName: details.patientName,
        serviceName: details.title,
        providerName: details.providerName || 'CareWell Specialist Network',
      };

      setReceipt(generatedReceipt);
      setProcessing(false);
      details.onSuccess(generatedReceipt);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {receipt ? 'Tax Invoice & Receipt' : 'CareWell Secure Checkout'}
              </h3>
              <p className="text-[11px] text-slate-500">256-Bit SSL Encrypted Healthcare Gateway</p>
            </div>
          </div>
          <button
            onClick={details.onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {receipt ? (
            /* ================= Success & Receipt View ================= */
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50 mb-3">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-900">Booking & Payment Confirmed</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your appointment has been registered with {receipt.providerName}
                </p>
              </div>

              {/* Printable Invoice Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs space-y-3 font-mono print:border-none print:p-0">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                  <span className="font-bold text-slate-800">CareWell Health Technologies</span>
                  <span className="text-emerald-700 font-bold">{receipt.receiptId}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PATIENT</span>
                    <span className="font-bold text-slate-800">{receipt.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">SERVICE</span>
                    <span className="font-bold text-slate-800 truncate block">{receipt.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TXN REF</span>
                    <span className="text-slate-700">{receipt.transactionRef}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PAYMENT METHOD</span>
                    <span className="text-slate-700">{receipt.method}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Clinical Consultation / Fee</span>
                    <span>₹{receipt.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%)</span>
                    <span>₹{receipt.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-sm border-t border-dashed border-slate-200 pt-1.5">
                    <span>Total Paid</span>
                    <span className="text-emerald-700">₹{receipt.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Printer size={15} />
                  Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={details.onClose}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ================= Checkout & Payment Methods ================= */
            <>
              {/* Order Summary Strip */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {details.serviceType.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm mt-1">{details.title}</h4>
                  <p className="text-xs text-slate-500">Patient: {details.patientName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Due</span>
                  <span className="text-lg font-black text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: QrCode },
                    { id: 'card', label: 'Cards', icon: CreditCard },
                    { id: 'netbanking', label: 'NetBank', icon: Building2 },
                    { id: 'cod', label: 'Pay Later', icon: Banknote },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = method === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setMethod(tab.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon size={18} className={isSelected ? 'text-emerald-600' : 'text-slate-400'} />
                        <span className="mt-1.5">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Method Detail Subform */}
              {method === 'upi' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Scan UPI QR with any app</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Instant Verification</span>
                  </div>
                  {/* Generated QR Code SVG */}
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="h-32 w-32 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="h-full w-full fill-slate-900">
                        <rect x="10" y="10" width="25" height="25" fill="#065f46" />
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="19" y="19" width="7" height="7" fill="#065f46" />
                        <rect x="65" y="10" width="25" height="25" fill="#065f46" />
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="74" y="19" width="7" height="7" fill="#065f46" />
                        <rect x="10" y="65" width="25" height="25" fill="#065f46" />
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                        <rect x="19" y="74" width="7" height="7" fill="#065f46" />
                        <rect x="42" y="15" width="6" height="6" />
                        <rect x="42" y="30" width="6" height="6" />
                        <rect x="52" y="22" width="6" height="6" />
                        <rect x="42" y="48" width="16" height="6" fill="#059669" />
                        <rect x="42" y="65" width="8" height="8" />
                        <rect x="65" y="48" width="8" height="8" />
                        <rect x="75" y="65" width="15" height="15" />
                        <rect x="80" y="70" width="5" height="5" fill="#ffffff" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-2">GPay &bull; PhonePe &bull; Paytm &bull; BHIM</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Or enter UPI VPA ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8891"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 block">Popular Banks</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => {}}
                        className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:bg-emerald-50/30"
                      >
                        <Building2 size={14} className="text-slate-400" />
                        <span>{bank}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === 'cod' && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Banknote size={16} className="text-emerald-700" /> Pay After Care Visit
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    Pay in cash or UPI directly to the visiting nurse, doctor, or delivery executive upon clinical service completion.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 transition active:scale-[0.99] disabled:opacity-50"
              >
                {processing ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
