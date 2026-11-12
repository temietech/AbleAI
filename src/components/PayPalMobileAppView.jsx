import React, { useState } from 'react';
import {
  Bell,
  QrCode,
  Search,
  Send,
  Download,
  CreditCard,
  Home,
  Clock,
  ChevronRight,
  Sparkles,
  Bot,
  X,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Wallet,
  Zap,
  Smartphone,
  Maximize2,
  Minimize2
} from 'lucide-react';
import AbleLogo from './AbleLogo.jsx';

export default function PayPalMobileAppView({
  lumpBalance = 2450.00,
  dailySafeSpend = 34.50,
  buckets = [],
  transactions = [],
  nudge,
  onOpenCheckout,
  onOpenCopilot,
  onSwitchToStandalone,
  isProcessing = false
}) {
  const [mobileTab, setMobileTab] = useState('home');
  const [showInAppSheet, setShowInAppSheet] = useState(false);
  const [isFramed, setIsFramed] = useState(true); // Toggle between phone mockup frame and full width

  const emergencyBucket = buckets.find(b => b.id === 'b1') || buckets[0] || { name: 'Emergency Buffer', current: 440, target: 1000 };
  const macbookBucket = buckets.find(b => b.id === 'b2') || buckets[1] || { name: 'MacBook Pro', current: 280, target: 1500 };

  return (
    <div className="py-6 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Top Controller Bar */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#003087]" />
          <span className="font-extrabold text-[#0A1628]">PayPal iOS / Android App</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFramed(!isFramed)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
          >
            {isFramed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{isFramed ? 'Full View' : 'Phone Frame'}</span>
          </button>
          <button
            onClick={onSwitchToStandalone}
            className="text-teal-700 hover:underline font-bold"
          >
            Standalone App →
          </button>
        </div>
      </div>

      {/* The Phone Container */}
      <div
        className={`transition-all duration-300 relative overflow-hidden bg-slate-100 ${
          isFramed
            ? 'w-full max-w-[395px] h-[820px] rounded-[52px] border-[10px] border-slate-900 shadow-2xl ring-1 ring-slate-800 flex flex-col'
            : 'w-full max-w-xl rounded-3xl border border-slate-200 shadow-xl flex flex-col'
        }`}
      >
        {/* iOS Dynamic Island & Status Bar (when framed) */}
        {isFramed && (
          <div className="bg-white pt-3 pb-1 px-7 flex items-center justify-between text-[11px] font-bold text-slate-900 select-none shrink-0 z-30">
            <span>9:41</span>
            {/* Dynamic Island Pill */}
            <div className="w-24 h-5 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-slate-900">
              <span className="text-[10px]">5G</span>
              <div className="w-5 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-900 rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* PayPal Mobile App Top Bar */}
        <header className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#003087] to-[#0079C1] text-white font-black text-xs flex items-center justify-center shadow-xs">
              AM
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 leading-none">Hello,</p>
              <p className="text-sm font-extrabold text-[#0A1628] leading-tight">Alex Mercer</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600">
              <QrCode className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1 right-1" />
            </button>
          </div>
        </header>

        {/* Scrollable Mobile App Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F8FAFC]">
          {/* PayPal Balance Mobile Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  PayPal balance
                </span>
                <div className="text-3xl font-black text-[#0A1628] tracking-tight mt-0.5">
                  £{lumpBalance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003087] flex items-center justify-center font-black italic text-sm">
                P
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button className="py-2.5 px-3 rounded-full bg-[#0070BA] hover:bg-[#005EA6] text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> Send
              </button>
              <button className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Request
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 🔥 THE ABLE AI SMART WIDGET CARD (INSIDE PAYPAL MOBILE APP)       */}
          {/* ================================================================= */}
          <div className="bg-gradient-to-br from-[#0A1628] to-[#132542] text-white rounded-3xl p-5 shadow-lg shadow-slate-900/10 relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />

            {/* Header: Able AI Brand & Badge */}
            <div className="flex items-center justify-between mb-3.5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Activity className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black tracking-tight text-white">ABLE AI</span>
                    <span className="text-[10px] font-bold text-teal-400">GUARDRAIL</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                In-App Widget
              </span>
            </div>

            {/* Daily Safe Spend Metric Bar */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/10 space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">
                  Safe-Spend Today
                </span>
                <span className="text-xs font-black text-teal-300">
                  £{(dailySafeSpend - 9.50).toFixed(2)} left
                </span>
              </div>

              {/* Progress bar representing spend velocity */}
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((9.50 / dailySafeSpend) * 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-300">
                <span>Daily Ceiling: £{dailySafeSpend.toFixed(2)}</span>
                <span className="text-emerald-400 font-bold">● Healthy Velocity</span>
              </div>
            </div>

            {/* AI Behavioural Nudge Pill & 1-Tap Mobile Sweep */}
            {nudge && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-teal-200 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">{nudge.headline}</span>
                </div>

                <button
                  onClick={() => onOpenCheckout(nudge.amount, nudge.targetId || 'b1', nudge.targetName || 'Emergency Buffer', nudge.targetType || 'bucket')}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span className="italic font-bold">Pay<span className="text-[#0079C1]">Pal</span></span>
                  <span>• 1-Tap Sweep £{Number(nudge.amount).toFixed(2)}</span>
                </button>
              </div>
            )}

            {/* Micro-Habit Chips inside the Widget */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-0.5 relative z-10">
              <button
                onClick={() => onOpenCheckout(10, emergencyBucket.id, emergencyBucket.name, 'bucket')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold shrink-0 transition-colors"
              >
                +£10 Emergency
              </button>
              <button
                onClick={() => onOpenCheckout(15, macbookBucket.id, macbookBucket.name, 'bucket')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold shrink-0 transition-colors"
              >
                +£15 MacBook
              </button>
              <button
                onClick={() => setShowInAppSheet(true)}
                className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-[10px] font-bold shrink-0 flex items-center gap-1"
              >
                <span>More</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Recent PayPal Mobile Activity */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Recent Activity
              </h4>
              <span className="text-[11px] font-bold text-blue-700">See all</span>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-[#003087] flex items-center justify-center shrink-0">
                      {tx.type.includes('Orders') ? (
                        <ArrowUpRight className="w-4 h-4 text-teal-600" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A1628] truncate max-w-[170px]">
                        {tx.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {tx.date} • {tx.status}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-black ${tx.status === 'Cleared' ? 'text-emerald-600' : 'text-[#0A1628]'}`}>
                    {tx.status === 'Cleared' ? '+' : '-'}£{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PayPal Bottom Mobile Tab Bar */}
        <nav className="bg-white border-t border-slate-200/90 px-6 py-2 flex items-center justify-between shrink-0 z-20">
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center gap-0.5 ${mobileTab === 'home' ? 'text-[#0070BA]' : 'text-slate-400'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold">Home</span>
          </button>

          <button
            onClick={() => setMobileTab('payments')}
            className={`flex flex-col items-center gap-0.5 ${mobileTab === 'payments' ? 'text-[#0070BA]' : 'text-slate-400'}`}
          >
            <Send className="w-5 h-5" />
            <span className="text-[10px] font-bold">Payments</span>
          </button>

          <button
            onClick={() => setMobileTab('wallet')}
            className={`flex flex-col items-center gap-0.5 ${mobileTab === 'wallet' ? 'text-[#0070BA]' : 'text-slate-400'}`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-bold">Wallet</span>
          </button>

          <button
            onClick={() => setMobileTab('activity')}
            className={`flex flex-col items-center gap-0.5 ${mobileTab === 'activity' ? 'text-[#0070BA]' : 'text-slate-400'}`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold">Activity</span>
          </button>
        </nav>

        {/* iOS Home Indicator Bar (when framed) */}
        {isFramed && (
          <div className="bg-white pb-2 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-900 rounded-full" />
          </div>
        )}

        {/* ================================================================= */}
        {/* NATIVE MOBILE IN-APP BOTTOM SHEET                                 */}
        {/* ================================================================= */}
        {showInAppSheet && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs z-50 flex flex-col justify-end animate-in fade-in duration-200">
            <div className="bg-white rounded-t-[32px] p-5 space-y-4 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              {/* Sheet handle */}
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-[#0A1628]">Able AI Hub in PayPal</h3>
                  <p className="text-xs text-slate-500">Autonomous Micro-Habits & Velocity</p>
                </div>
                <button
                  onClick={() => setShowInAppSheet(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Buckets List */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Savings Buckets ({buckets.length})
                </p>
                {buckets.map((b) => (
                  <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#0A1628]">{b.name}</p>
                      <p className="text-[10px] text-slate-400">Rule: {b.autoRule}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-teal-700">£{b.current.toFixed(2)}</p>
                      <button
                        onClick={() => {
                          setShowInAppSheet(false);
                          onOpenCheckout(15, b.id, b.name, 'bucket');
                        }}
                        className="text-[10px] font-bold text-blue-700 hover:underline"
                      >
                        + Fund £15
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Copilot Link */}
              <button
                onClick={() => {
                  setShowInAppSheet(false);
                  onOpenCopilot();
                }}
                className="w-full py-3 rounded-2xl bg-[#0A1628] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Bot className="w-4 h-4 text-teal-400" />
                <span>Ask Able AI Copilot</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
