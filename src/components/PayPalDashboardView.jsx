import React, { useState } from 'react';
import {
  Bell,
  Settings,
  Search,
  Send,
  Download,
  CreditCard,
  Building,
  Coffee,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import AblePayPalWidget from './AblePayPalWidget.jsx';

export default function PayPalDashboardView({
  lumpBalance = 2450.00,
  dailySafeSpend = 34.50,
  buckets = [],
  transactions = [],
  nudge,
  onOpenCheckout,
  onOpenCopilot,
  onSwitchToStandalone,
  onOpenCheckoutDemo,
  isProcessing = false
}) {
  const [activePaypalNav, setActivePaypalNav] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0F172A] font-sans pb-16">
      {/* Simulation Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#0A1628] text-white py-2.5 px-4 text-xs font-semibold flex flex-wrap items-center justify-between border-b border-blue-800/60 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span><strong>PayPal Environment Simulation:</strong> Demonstrating Able AI embedded natively as a widget inside PayPal.</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCheckoutDemo}
            className="px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[11px] transition-colors"
          >
            🛍️ Test Checkout Guardrail
          </button>
          <button
            onClick={onSwitchToStandalone}
            className="text-teal-300 hover:text-white underline text-[11px]"
          >
            Switch to Standalone App →
          </button>
        </div>
      </div>

      {/* Authentic PayPal Brand Header */}
      <header className="bg-[#003087] text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* PayPal Logo */}
            <div className="flex items-center gap-1.5 select-none cursor-pointer">
              <span className="italic font-black text-2xl tracking-tight text-white">
                Pay<span className="text-[#009CDE]">Pal</span>
              </span>
            </div>

            {/* PayPal Primary Nav */}
            <nav className="hidden md:flex items-center space-x-1 text-sm font-bold">
              {['Dashboard', 'Send and Request', 'Wallet', 'Activity', 'Deals'].map((tab) => {
                const id = tab.toLowerCase().replace(/ /g, '-');
                const active = activePaypalNav === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActivePaypalNav(id)}
                    className={`px-3.5 py-2 rounded-full transition-colors ${
                      active ? 'bg-white/20 text-white' : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-blue-100 hover:text-white hover:bg-white/10">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-white text-[#003087] font-black text-xs flex items-center justify-center">
                AM
              </div>
              <span className="text-xs font-bold hidden sm:inline">Alex Mercer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main PayPal Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): PayPal Wallet & Activity */}
          <div className="lg:col-span-7 space-y-6">
            {/* PayPal Balance Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    PayPal balance
                  </p>
                  <div className="text-4xl font-black text-[#0A1628] tracking-tight mt-1">
                    £{lumpBalance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    ✓ Available to spend or transfer
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button className="px-5 py-2.5 rounded-full bg-[#0070BA] hover:bg-[#005EA6] text-white font-bold text-xs shadow-sm transition-all">
                    Transfer Funds
                  </button>
                  <button className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all">
                    Add Money
                  </button>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-1.5">
                    <Send className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Send</span>
                </button>

                <button className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-1.5">
                    <Download className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Request</span>
                </button>

                <button
                  onClick={onOpenCheckoutDemo}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-amber-50/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-1.5">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Test Guardrail</span>
                </button>
              </div>
            </div>

            {/* Merchant Checkout Guardrail Callout */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl p-5 border border-amber-200/80 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#0A1628]">
                    Checkout Guardrail Feature Active
                  </h4>
                  <p className="text-xs text-slate-600">
                    Able AI monitors online checkouts via PayPal to prevent accidental safe-spend overshoots.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenCheckoutDemo}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shrink-0 shadow-sm transition-all cursor-pointer"
              >
                Launch Demo
              </button>
            </div>

            {/* Recent PayPal Activity Feed */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#0A1628]">Recent PayPal Activity</h3>
                <span className="text-xs font-bold text-blue-700 hover:underline cursor-pointer">
                  View All Activity
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-[#003087] flex items-center justify-center shrink-0">
                        {tx.type.includes('Payout') ? (
                          <ArrowDownLeft className="w-5 h-5 text-indigo-600" />
                        ) : tx.type.includes('Orders') ? (
                          <ArrowUpRight className="w-5 h-5 text-teal-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0A1628]">{tx.description}</p>
                        <p className="text-xs text-slate-400 font-medium">
                          {tx.date} • {tx.type} • ID: {tx.id}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.status === 'Cleared' ? 'text-emerald-600' : 'text-[#0A1628]'}`}>
                        {tx.status === 'Cleared' ? '+' : '-'}£{tx.amount.toFixed(2)}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Embedded Able AI Widget */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Embedded PayPal Mini-App
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                <Sparkles className="w-3 h-3 text-teal-600" /> Active Widget
              </span>
            </div>

            {/* Native Able AI Widget Component */}
            <AblePayPalWidget
              lumpBalance={lumpBalance}
              dailySafeSpend={dailySafeSpend}
              buckets={buckets}
              nudge={nudge}
              onOpenCheckout={onOpenCheckout}
              onOpenCopilot={onOpenCopilot}
              onSwitchToStandalone={onSwitchToStandalone}
              isProcessing={isProcessing}
            />

            {/* Widget Explanation Note for Judges */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <p className="font-bold text-[#0A1628] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Why Embedded in PayPal?
              </p>
              <p className="leading-relaxed text-slate-500">
                Embedding Able AI directly into PayPal removes authentication friction: users can approve micro-sweeps instantly using their PayPal balance without leaving their wallet.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
