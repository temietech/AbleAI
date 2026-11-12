import React from 'react';
import { X, RefreshCw, Lock, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';

export default function PayPalModal({
  modalData,
  isProcessing,
  lumpBalance,
  onCompletePayment,
  onClose
}) {
  if (!modalData) return null;

  const { amount, targetName, targetType } = modalData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* PayPal Top Header */}
        <div className="bg-[#003087] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="italic font-black text-2xl tracking-tight">
              Pay<span className="text-[#009CDE]">Pal</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/15 text-sky-200">
              Developer Sandbox
            </span>
          </div>
          <button
            onClick={() => !isProcessing && onClose()}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Merchant / Destination Summary */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Destination {targetType === 'group' ? 'Pool' : 'Bucket'}
              </p>
              <p className="text-base font-extrabold text-[#0A1628] mt-0.5">
                Able AI • {targetName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transfer Amount
              </p>
              <p className="text-2xl font-black text-[#003087]">
                £{Number(amount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Sandbox Buyer Details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">Sandbox Buyer</span>
              <span className="font-extrabold text-[#0A1628]">
                sb-alex-mercer@personal.example.com
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">Funding Source</span>
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#003087]" /> PayPal Balance (£
                {lumpBalance.toFixed(2)})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">API Endpoint</span>
              <span className="font-mono text-[11px] font-semibold text-teal-700">
                POST /v2/checkout/orders
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onCompletePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-base shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Capturing PayPal Order...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Complete Payment (£{Number(amount).toFixed(2)})
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted via PayPal Sandbox SDK • Instant Reconciliation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
