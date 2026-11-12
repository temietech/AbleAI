import React from 'react';
import { Menu, Bot } from 'lucide-react';
import AbleLogo from './AbleLogo.jsx';

export default function Navbar({
  activeTab,
  onSelectTab,
  navItems,
  onOpenSidebar,
  onOpenCopilot
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            className="p-2.5 rounded-xl bg-[#0A1628] text-white hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline pr-1">
              Menu
            </span>
          </button>
          <AbleLogo showSubtitle={true} lightText={false} />
        </div>

        {/* Quick Pill Tab Switcher */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-white text-[#0A1628] shadow-sm'
                  : 'text-slate-500 hover:text-[#0A1628]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Bot className="w-4 h-4 text-teal-200" />
            <span className="hidden sm:inline">Ask AI Agent</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            PayPal Sandbox
          </div>
        </div>
      </div>
    </header>
  );
}
