import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#0A1628] text-white px-5 py-4 rounded-2xl shadow-2xl border border-teal-500/30 flex items-start gap-3.5 animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0 mt-0.5">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-extrabold text-white">{toast.title}</p>
        <p className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.subtitle}</p>
      </div>
    </div>
  );
}
