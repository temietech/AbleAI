import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

export default function CreateBucketModal({ isOpen, onClose, onCreateBucket }) {
  const [form, setForm] = useState({
    name: '',
    target: '500',
    autoRule: 'Sweep £10 every Monday'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    onCreateBucket({
      name: form.name.trim(),
      target: Math.max(50, Number(form.target) || 500),
      autoRule: form.autoRule || 'Manual micro-transfers'
    });

    setForm({ name: '', target: '500', autoRule: 'Sweep £10 every Monday' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#0A1628]">Create Savings Bucket</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Bucket Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Tokyo Trip or Post-Grad Security"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              Target Amount (£)
            </label>
            <input
              type="number"
              required
              min="20"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              AI Behavioural Rule
            </label>
            <input
              type="text"
              value={form.autoRule}
              onChange={(e) => setForm({ ...form, autoRule: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 text-white font-extrabold text-sm shadow-md hover:from-teal-500 hover:to-blue-500 transition-all cursor-pointer"
          >
            Launch Bucket & Connect to PayPal
          </button>
        </form>
      </div>
    </div>
  );
}
