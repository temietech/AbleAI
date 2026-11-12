import React from 'react';
import { Wallet, Activity, PiggyBank, Users } from 'lucide-react';

export default function KpiCards({
  lumpBalance = 2450.00,
  dailySafeSpend = 34.50,
  totalSavedInBuckets = 840.00,
  bucketCount = 3,
  groupGoals = []
}) {
  const totalPooled = groupGoals.reduce((sum, g) => sum + g.current, 0);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* KPI 1: Total Lump Balance */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Lump Balance
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#0A1628] tracking-tight">
          £{lumpBalance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center justify-between">
          <span>Available PayPal + Bank Cash</span>
          <span className="text-emerald-600 font-bold text-[11px]">+£2.5k Grant Cleared</span>
        </p>
      </div>

      {/* KPI 2: Daily Safe-Spend Guardrail */}
      <div className="bg-gradient-to-br from-[#0A1628] to-[#132542] text-white rounded-2xl p-6 shadow-lg shadow-slate-900/15 relative overflow-hidden transition-all hover:shadow-xl">
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
            Daily Safe-Spend
          </span>
          <div className="p-2 rounded-xl bg-white/10 text-teal-300">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black tracking-tight relative z-10 flex items-baseline gap-1">
          £{dailySafeSpend.toFixed(2)}
          <span className="text-sm font-medium text-slate-300">/day</span>
        </div>
        <p className="text-xs text-teal-200/80 font-medium mt-1.5 relative z-10">
          Gemini AI cash-velocity ceiling
        </p>
      </div>

      {/* KPI 3: Total Saved in Buckets */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Saved in Buckets
          </span>
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-teal-600 tracking-tight">
          £{totalSavedInBuckets.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1.5">
          Across {bucketCount} autonomous micro-buckets
        </p>
      </div>

      {/* KPI 4: Active Group Goals */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/70 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Collaborative Pools
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-black text-[#0A1628] tracking-tight">
          {groupGoals.length} Pools
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1.5">
          £{totalPooled.toFixed(0)} pooled via PayPal P2P
        </p>
      </div>
    </section>
  );
}
