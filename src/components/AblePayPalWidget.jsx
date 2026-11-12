import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Activity, Bot, ChevronRight, Zap, RefreshCw, Lock } from 'lucide-react';
import AbleLogo from './AbleLogo.jsx';

export default function AblePayPalWidget({
  lumpBalance = 2450.00,
  dailySafeSpend = 34.50,
  buckets = [],
  nudge,
  onOpenCheckout,
  onOpenCopilot,
  onSwitchToStandalone,
  isProcessing = false
}) {
  const emergencyBucket = buckets.find(b => b.id === 'b1') || buckets[0] || { name: 'Emergency Buffer', current: 440, target: 1000 };
  const macbookBucket = buckets.find(b => b.id === 'b2') || buckets[1] || { name: 'MacBook Pro', current: 280, target: 1500 };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all">
      {/* Widget Header with Dual Branding */}
      <div className="bg-gradient-to-r from-[#0A1628] to-[#132542] text-white p-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AbleLogo showSubtitle={false} lightText={true} />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            PayPal Embedded
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2 font-medium">
          Autonomous cash-velocity guardrail inside your PayPal account.
        </p>
      </div>

      {/* Main Widget Content */}
      <div className="p-5 space-y-4">
        {/* Dynamic Safe Spend Dial / Metric */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/40 border border-teal-100/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Today's Safe-Spend Limit</span>
            </div>
            <div className="text-2xl font-black text-[#0A1628] tracking-tight mt-0.5">
              £{dailySafeSpend.toFixed(2)}
              <span className="text-xs font-semibold text-slate-500"> / day</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              £9.50 spent today • £{(dailySafeSpend - 9.50).toFixed(2)} remaining safe
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white border border-teal-200 shadow-2xs flex flex-col items-center justify-center text-teal-700">
            <span className="text-[10px] font-black uppercase">Status</span>
            <span className="text-xs font-black text-emerald-600">SAFE</span>
          </div>
        </div>

        {/* AI Behavioural Micro-Nudge Card */}
        {nudge && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                <Sparkles className="w-3 h-3 text-teal-600" />
                {nudge.badge || 'Surplus Detected'}
              </span>
              <span className="text-[10px] font-bold text-slate-400">Gemini Reasoning</span>
            </div>

            <p className="text-xs font-bold text-[#0A1628] leading-snug">
              {nudge.headline}
            </p>

            <button
              onClick={() => onOpenCheckout(nudge.amount, nudge.targetId || 'b1', nudge.targetName || 'Emergency Buffer', nudge.targetType || 'bucket')}
              disabled={isProcessing}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="italic text-sm">Pay<span className="text-[#0079C1]">Pal</span></span>
              <span>• Auto-Sweep £{Number(nudge.amount).toFixed(2)}</span>
            </button>
          </div>
        )}

        {/* Mini Quick-Sweep Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-600 uppercase tracking-wider text-[10px]">
              Instant Micro-Habit Sweeps
            </span>
            <span className="text-[11px] text-teal-700 font-bold">1-Click PayPal</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenCheckout(10, emergencyBucket.id, emergencyBucket.name, 'bucket')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/60 border border-slate-200/80 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="text-[11px] font-bold text-[#0A1628] group-hover:text-teal-700">
                  +£10 Emergency
                </p>
                <p className="text-[10px] text-slate-400">£{emergencyBucket.current.toFixed(0)} saved</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
            </button>

            <button
              onClick={() => onOpenCheckout(15, macbookBucket.id, macbookBucket.name, 'bucket')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="text-[11px] font-bold text-[#0A1628] group-hover:text-blue-700">
                  +£15 MacBook
                </p>
                <p className="text-[10px] text-slate-400">£{macbookBucket.current.toFixed(0)} saved</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={onOpenCopilot}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>Ask Copilot</span>
          </button>

          {onSwitchToStandalone && (
            <button
              onClick={onSwitchToStandalone}
              className="flex-1 py-2 px-3 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>Full App</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
