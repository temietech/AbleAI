import React, { useState } from 'react';
import { X, ShoppingBag, ShieldAlert, Users, Sparkles, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

export default function PayPalCheckoutSimulationModal({
  isOpen,
  onClose,
  dailySafeSpend = 34.50,
  onApplySplit,
  onProceedFull
}) {
  const [selectedOption, setSelectedOption] = useState('split');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const itemPrice = 45.00;
  const overshoot = itemPrice - dailySafeSpend; // £10.50

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (selectedOption === 'split') {
        onApplySplit({
          amount: itemPrice / 2,
          friendHandle: '@maya_r',
          description: 'ASOS Winter Jacket (50% split)'
        });
      } else {
        onProceedFull({
          amount: itemPrice,
          description: 'ASOS Winter Jacket'
        });
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Merchant Banner */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-teal-400" />
            <span className="font-extrabold tracking-wide uppercase">ASOS Store Checkout • £45.00</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PayPal Checkout Header */}
        <div className="bg-[#003087] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="italic font-black text-2xl tracking-tight text-white">
              Pay<span className="text-[#009CDE]">Pal</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-sky-200">
              Checkout Assistant
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-200">Total: £45.00</span>
        </div>

        {/* Able AI Guardrail Alert Box inside PayPal */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Able AI Safe-Spend Guardrail Triggered</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Your daily safe-spend limit today is <strong>£{dailySafeSpend.toFixed(2)}</strong>. This purchase exceeds your ceiling by <strong className="text-amber-950 font-black">£{overshoot.toFixed(2)}</strong> and will accelerate cash-flow drain.
            </p>
          </div>

          {/* Agentic Decision Choices */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Select Agentic Commerce Action:
            </p>

            {/* Option 1: Split with friend */}
            <label
              onClick={() => setSelectedOption('split')}
              className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedOption === 'split'
                  ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#0A1628]">
                      Split 50% with @maya_r via PayPal P2P
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Your share: £22.50 (keeps you £{(dailySafeSpend - 22.50).toFixed(2)} under daily safe ceiling)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-teal-700">Recommended</span>
              </div>
            </label>

            {/* Option 2: Full payment & adjust guardrail */}
            <label
              onClick={() => setSelectedOption('compensate')}
              className={`block p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedOption === 'compensate'
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#0A1628]">
                      Pay in Full & Auto-Adjust Safe-Spend
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Temporarily adjust next 3 days safe-spend by -£3.50/day to stay on target
                    </p>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing via PayPal Sandbox...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Authorize with PayPal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
