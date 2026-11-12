import React from 'react';
import { Sparkles, RefreshCw, Bot, ArrowRight } from 'lucide-react';

export default function BehaviouralNudge({
  nudge,
  isAnalyzing,
  onRunAnalysis,
  onOpenCheckout,
  onOpenCopilot
}) {
  if (!nudge) return null;

  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden relative">
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600" />
      <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-teal-500/15 to-blue-600/15 text-teal-800 border border-teal-500/20">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Able AI Behavioural Nudge
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {nudge.badge}
            </span>
            {nudge.source && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                {nudge.source === 'live_gemini_api' ? 'Gemini 1.5/2.0 API' : 'Gemini Behavioral Engine'}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1628] tracking-tight leading-snug">
            {nudge.headline}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {nudge.rationale}
          </p>
          {nudge.safeSpendAdjustment && (
            <p className="text-xs font-bold text-teal-700 bg-teal-50/70 inline-block px-3 py-1 rounded-lg">
              ✓ {nudge.safeSpendAdjustment}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 min-w-[260px]">
          <button
            onClick={() =>
              onOpenCheckout(
                nudge.amount,
                nudge.targetId || 'b1',
                nudge.targetName || 'Emergency Buffer',
                nudge.targetType || 'bucket'
              )
            }
            className="w-full py-3.5 px-5 rounded-xl bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-extrabold text-sm shadow-md shadow-amber-400/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span className="italic font-black text-base tracking-tight">
              Pay<span className="text-[#0079C1]">Pal</span>
            </span>
            <span>•</span>
            <span>
              Approve & Fund £{Number(nudge.amount).toFixed(2)}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-teal-400' : 'text-teal-400'}`} />
              {isAnalyzing ? 'Reasoning...' : 'Recalculate AI'}
            </button>

            <button
              onClick={onOpenCopilot}
              className="py-3 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              <span>Ask Agent</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
