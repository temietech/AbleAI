import React from 'react';
import { ShieldCheck, Laptop, Zap, Plus, ArrowRight } from 'lucide-react';

export default function SavingsBuckets({
  buckets = [],
  onOpenCheckout,
  onOpenNewBucketModal,
  onNavigateToBucketsTab,
  showCreateButton = true,
  isFullView = false
}) {
  const renderBucketIcon = (type) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="w-5 h-5 text-blue-600" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-teal-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {isFullView && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#0A1628]">Autonomous Savings Buckets</h2>
            <p className="text-sm text-slate-500">
              Turn small daily surpluses into dedicated wealth & emergency cushions.
            </p>
          </div>
          {showCreateButton && (
            <button
              onClick={onOpenNewBucketModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 self-start"
            >
              <Plus className="w-4 h-4" /> Create New Bucket
            </button>
          )}
        </div>
      )}

      {!isFullView && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0A1628]">Smart Savings Buckets</h3>
            <p className="text-xs text-slate-500 font-medium">
              Micro-habits automated via PayPal Orders API
            </p>
          </div>
          {onNavigateToBucketsTab && (
            <button
              onClick={onNavigateToBucketsTab}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className={`grid gap-6 ${isFullView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
        {buckets.map((bucket) => {
          const pct = Math.min(100, Math.round((bucket.current / bucket.target) * 100));

          if (!isFullView) {
            // Compact Overview Card
            return (
              <div
                key={bucket.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-3 transition-all hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                      {renderBucketIcon(bucket.iconType)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0A1628]">{bucket.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {bucket.autoRule}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-[#0A1628]">
                      £{bucket.current.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      of £{bucket.target.toFixed(0)} ({pct}%)
                    </p>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onOpenCheckout(20, bucket.id, bucket.name, 'bucket')}
                    className="text-xs font-extrabold px-3.5 py-1.5 rounded-lg bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] transition-colors"
                  >
                    + Quick Fund £20 via PayPal
                  </button>
                </div>
              </div>
            );
          }

          // Full View Detailed Card
          return (
            <div
              key={bucket.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    {renderBucketIcon(bucket.iconType)}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                    {pct}% Funded
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-[#0A1628]">{bucket.name}</h3>
                  <p className="text-xs font-semibold text-teal-600 mt-0.5">
                    Rule: {bucket.autoRule}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-[#0A1628]">
                      £{bucket.current.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Goal: £{bucket.target.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => onOpenCheckout(25, bucket.id, bucket.name, 'bucket')}
                  className="w-full py-3 px-4 rounded-xl bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="italic font-black text-base">
                    Pay<span className="text-[#0079C1]">Pal</span>
                  </span>
                  <span>• Fund £25.00</span>
                </button>
                <button
                  onClick={() => onOpenCheckout(10, bucket.id, bucket.name, 'bucket')}
                  className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Quick Micro-Habit (+£10.00)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
