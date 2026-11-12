import React from 'react';
import { X, LayoutDashboard, PiggyBank, Users, BookOpen } from 'lucide-react';
import AbleLogo from './AbleLogo.jsx';

export default function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  navItems
}) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0A1628]/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1628] text-slate-200 flex flex-col border-r border-slate-800 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
          <AbleLogo showSubtitle={false} lightText={true} />
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Autonomous Finance
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-teal-500/20 to-blue-600/10 text-white border-l-4 border-teal-400 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-5 m-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0F172A] border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-sm">
              AM
            </div>
            <div>
              <p className="text-sm font-bold text-white">Alex Mercer</p>
              <p className="text-xs text-teal-400 font-medium">@alex_m • PayPal Linked</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Sandbox Mode</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
