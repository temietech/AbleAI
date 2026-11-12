import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard,
  PiggyBank,
  Users,
  BookOpen
} from 'lucide-react';

import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import KpiCards from './components/KpiCards.jsx';
import BehaviouralNudge from './components/BehaviouralNudge.jsx';
import SavingsBuckets from './components/SavingsBuckets.jsx';
import GroupGoals from './components/GroupGoals.jsx';
import LiveLedger from './components/LiveLedger.jsx';
import PayPalModal from './components/PayPalModal.jsx';
import AgentCopilotDrawer from './components/AgentCopilotDrawer.jsx';
import CreateBucketModal from './components/CreateBucketModal.jsx';
import Toast from './components/Toast.jsx';

// Dual Mode & Mobile App Components
import PayPalMobileAppView from './components/PayPalMobileAppView.jsx';
import PayPalCheckoutSimulationModal from './components/PayPalCheckoutSimulationModal.jsx';
import EmbedCodeModal from './components/EmbedCodeModal.jsx';
import SpreadsheetImportModal from './components/SpreadsheetImportModal.jsx';

import { createOrder, captureOrder, disbursePayout, fetchAiAnalysis } from './services/api.js';

export default function App() {
  // Application Mode: 'standalone' (Able AI App) OR 'paypal_mobile' (Inside PayPal Mobile App)
  const [appMode, setAppMode] = useState('standalone');

  // Navigation & Drawer State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals for Mobile, Embedded & Spreadsheet Experience
  const [isCheckoutDemoOpen, setIsCheckoutDemoOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);

  // Core Financial State (Persistent in Local Storage)
  const [lumpBalance, setLumpBalance] = useState(() => {
    const s = localStorage.getItem('able_lump');
    return s ? parseFloat(s) : 2450.00;
  });
  const [dailySafeSpend, setDailySafeSpend] = useState(() => {
    const s = localStorage.getItem('able_safe');
    return s ? parseFloat(s) : 34.50;
  });

  // Savings Buckets State
  const [buckets, setBuckets] = useState(() => {
    const s = localStorage.getItem('able_buckets');
    return s ? JSON.parse(s) : [
    {
      id: 'b1',
      name: 'Emergency Buffer',
      category: 'Safety Net',
      current: 440.00,
      target: 1000.00,
      autoRule: 'Sweep £15 every Friday',
      iconType: 'shield'
    },
    {
      id: 'b2',
      name: 'MacBook Pro Upgrade',
      category: 'Tech & Career',
      current: 280.00,
      target: 1500.00,
      autoRule: 'Round-up spare change (2x)',
      iconType: 'laptop'
    },
    {
      id: 'b3',
      name: 'Post-Grad ISA',
      category: 'Wealth',
      current: 120.00,
      target: 2000.00,
      autoRule: '5% of freelance payouts',
      iconType: 'zap'
    }
  ];
  });

  // Group Goals State
  const [groupGoals, setGroupGoals] = useState([
    {
      id: 'g1',
      name: 'Ibiza Summer Trip',
      subtitle: 'Flights + Villa Deposit',
      current: 1150.00,
      target: 1200.00,
      members: [
        { handle: '@alex_m', paid: 400 },
        { handle: '@sarah_j', paid: 400 },
        { handle: '@liam_k', paid: 350 }
      ],
      payoutTriggered: false
    },
    {
      id: 'g2',
      name: 'Flatmate Bills Pool',
      subtitle: 'November Council Tax & Fiber',
      current: 240.00,
      target: 360.00,
      members: [
        { handle: '@alex_m', paid: 120 },
        { handle: '@maya_r', paid: 120 }
      ],
      payoutTriggered: false
    }
  ]);

  // Live Ledger State (Persistent)
  const [transactions, setTransactions] = useState(() => {
    const s = localStorage.getItem('able_txs');
    return s ? JSON.parse(s) : [
    {
      id: 'PAY-894120A',
      date: '2026-11-12',
      description: 'AI Surplus Sweep → Emergency Buffer',
      bucket: 'Emergency Buffer',
      type: 'PayPal Orders v2',
      amount: 20.00,
      status: 'Verified'
    },
    {
      id: 'PAY-893904C',
      date: '2026-11-10',
      description: 'Group Contribution → Ibiza Summer Trip',
      bucket: 'Ibiza Summer Trip',
      type: 'PayPal P2P Pool',
      amount: 50.00,
      status: 'Verified'
    },
    {
      id: 'PAY-892118F',
      date: '2026-11-08',
      description: 'Spare Change Auto-Roundup',
      bucket: 'MacBook Pro Upgrade',
      type: 'PayPal Orders v2',
      amount: 14.50,
      status: 'Verified'
    },
    {
      id: 'INC-100492L',
      date: '2026-11-01',
      description: 'Student Maintenance / Salary Tranche',
      bucket: 'Lump Balance',
      type: 'Direct Deposit',
      amount: 2534.50,
      status: 'Cleared'
    }
  ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('able_lump', lumpBalance.toString());
  }, [lumpBalance]);

  useEffect(() => {
    localStorage.setItem('able_safe', dailySafeSpend.toString());
  }, [dailySafeSpend]);

  useEffect(() => {
    localStorage.setItem('able_buckets', JSON.stringify(buckets));
  }, [buckets]);

  useEffect(() => {
    localStorage.setItem('able_txs', JSON.stringify(transactions));
  }, [transactions]);

  // Open Banking Live Webhook Simulator
  const handleSimulateOpenBankingSpend = (merchant = 'Pret A Manger', amount = 3.80) => {
    setDailySafeSpend((prev) => Math.max(0, +(prev - amount).toFixed(2)));
    setLumpBalance((prev) => Math.max(0, +(prev - amount).toFixed(2)));
    const newTx = {
      id: `OB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      description: `Live Card Spend • ${merchant}`,
      bucket: 'Daily Living',
      type: 'Open Banking Webhook (Live)',
      amount: amount,
      status: 'Verified'
    };
    setTransactions((prev) => [newTx, ...prev]);
    triggerToast('Open Banking Webhook Received', `Spent £${amount.toFixed(2)} at ${merchant}. Safe spend dynamically recalibrated!`);
  };

  // AI Behavioural Nudge State
  const [currentNudge, setCurrentNudge] = useState({
    id: 'n1',
    badge: 'Surplus Detected',
    headline: 'You are £25.00 under your daily safe-spend limit today.',
    rationale:
      'By skipping takeaway coffee and cooking at home over the last 48 hours, you created a safe cash-flow cushion without affecting your £34.50/day guardrail.',
    amount: 25.00,
    targetId: 'b1',
    targetName: 'Emergency Buffer',
    targetType: 'bucket',
    safeSpendAdjustment: 'Leaves £33.80/day cushion'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // PayPal Sandbox Checkout Modal State
  const [paypalModal, setPaypalModal] = useState(null); // { amount, targetId, targetName, targetType }
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);

  // Create Bucket Modal State
  const [showNewBucketModal, setShowNewBucketModal] = useState(false);

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'buckets', label: 'Savings Buckets', icon: PiggyBank },
    { id: 'groups', label: 'Group Goals', icon: Users },
    { id: 'ledger', label: 'Live Ledger (AG Grid)', icon: BookOpen }
  ];

  // Computed Totals
  const totalSavedInBuckets = useMemo(
    () => buckets.reduce((sum, b) => sum + b.current, 0),
    [buckets]
  );

  // Helpers
  const triggerToast = (title, subtitle) => {
    setToast({ title, subtitle });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleRunNewAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await fetchAiAnalysis({
        lumpBalance,
        dailySafeSpend,
        buckets,
        transactions,
        daysRemaining: 24
      });
      setCurrentNudge({
        ...result,
        targetId: buckets.find(b => b.name === result.targetName)?.id || 'b1'
      });
      triggerToast(
        'Gemini Behavioural Engine Updated',
        'Cash-flow velocity recalculated with fresh micro-habit recommendations.'
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openPayPalCheckout = (amount, targetId, targetName, targetType) => {
    setPaypalModal({
      amount: Number(amount),
      targetId,
      targetName,
      targetType
    });
  };

  const handleCompletePayPalPayment = async () => {
    if (!paypalModal) return;
    setIsProcessingPayPal(true);

    try {
      const { amount, targetId, targetName, targetType } = paypalModal;

      // 1. Create order on backend (or simulated sandbox)
      const orderRes = await createOrder({
        amount,
        currency: 'GBP',
        description: `Micro-Transfer to ${targetName}`,
        customId: targetId
      });

      // 2. Capture order
      const captureRes = await captureOrder(orderRes.orderId);
      const txId = captureRes.transactionId || `PAY-${Math.floor(100000 + Math.random() * 900000)}X`;

      // 3. Update Balance & recalculate safe spend
      setLumpBalance((prev) => Math.max(0, +(prev - amount).toFixed(2)));
      setDailySafeSpend((prev) => Math.max(12, +(prev - amount / 30).toFixed(2)));

      // 4. Update Target Bucket or Group Goal
      if (targetType === 'bucket') {
        setBuckets((prev) =>
          prev.map((b) =>
            b.id === targetId ? { ...b, current: +(b.current + amount).toFixed(2) } : b
          )
        );
      } else if (targetType === 'group') {
        setGroupGoals((prev) =>
          prev.map((g) => {
            if (g.id !== targetId) return g;
            const updatedMembers = g.members.map((m) =>
              m.handle === '@alex_m' ? { ...m, paid: m.paid + amount } : m
            );
            return {
              ...g,
              current: +(g.current + amount).toFixed(2),
              members: updatedMembers
            };
          })
        );
      }

      // 5. Prepend verified transaction row to AG Grid Ledger
      const newTx = {
        id: txId,
        date: new Date().toISOString().split('T')[0],
        description: `PayPal Micro-Transfer → ${targetName}`,
        bucket: targetName,
        type: targetType === 'group' ? 'PayPal Group Pool' : 'PayPal Orders v2',
        amount: amount,
        status: 'Verified'
      };
      setTransactions((prev) => [newTx, ...prev]);

      // 6. Close modal & show confirmation toast
      setPaypalModal(null);
      triggerToast(
        `PayPal Transfer Complete: £${amount.toFixed(2)} moved to ${targetName}`,
        `Sandbox Order ID ${txId} verified & logged.`
      );
    } catch (err) {
      triggerToast('PayPal Error', err.message || 'Payment capture failed.');
    } finally {
      setIsProcessingPayPal(false);
    }
  };

  const handleInviteFriend = (goalId, handle) => {
    const formatted = handle.startsWith('@') ? handle.toLowerCase() : `@${handle.toLowerCase()}`;

    setGroupGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        if (g.members.some((m) => m.handle === formatted)) return g;
        return {
          ...g,
          members: [...g.members, { handle: formatted, paid: 0 }]
        };
      })
    );

    triggerToast(
      `Invited ${formatted} via PayPal`,
      'Payment link & split request dispatched to their PayPal handle.'
    );
  };

  const handleTriggerGroupPayout = async (goal) => {
    try {
      const payoutRes = await disbursePayout({
        amount: goal.current,
        recipientHandle: '@sarah_j',
        note: `Disbursement for ${goal.name}`
      });

      const payoutId = payoutRes.payoutId || `PYO-${Math.floor(100000 + Math.random() * 900000)}P`;

      setGroupGoals((prev) =>
        prev.map((g) => (g.id === goal.id ? { ...g, payoutTriggered: true } : g))
      );

      setTransactions((prev) => [
        {
          id: payoutId,
          date: new Date().toISOString().split('T')[0],
          description: `PayPal Payout Disbursed → ${goal.name}`,
          bucket: goal.name,
          type: 'PayPal Payouts API',
          amount: goal.current,
          status: 'Disbursed'
        },
        ...prev
      ]);

      triggerToast(
        `PayPal Payout Executed (£${goal.current.toFixed(2)})`,
        `Funds released to group organizer via PayPal Payouts API (${payoutId}).`
      );
    } catch (err) {
      triggerToast('Payout Error', err.message);
    }
  };

  const handleCreateBucket = (data) => {
    const created = {
      id: `b-${Date.now()}`,
      name: data.name,
      category: 'Custom Goal',
      current: 0,
      target: data.target,
      autoRule: data.autoRule,
      iconType: 'shield'
    };
    setBuckets((prev) => [...prev, created]);
    setShowNewBucketModal(false);
    triggerToast(
      `Created Bucket: ${created.name}`,
      `Target £${created.target.toFixed(2)} ready for PayPal funding.`
    );
  };

  // Agentic Copilot Action Trigger
  const handleCopilotAction = (action) => {
    if (action.type === 'PAYPAL_SWEEP') {
      const targetBucket = buckets.find(b => b.name === action.targetName);
      const targetGroup = groupGoals.find(g => g.name === action.targetName);
      const targetId = targetBucket?.id || targetGroup?.id || 'b1';
      const targetType = action.targetType || (targetGroup ? 'group' : 'bucket');

      setIsCopilotOpen(false);
      openPayPalCheckout(action.amount, targetId, action.targetName, targetType);
    }
  };

  // Checkout Guardrail Handlers
  const handleCheckoutSplit = ({ amount, friendHandle, description }) => {
    const txId = `PAY-${Math.floor(100000 + Math.random() * 900000)}S`;
    setLumpBalance((prev) => Math.max(0, +(prev - amount).toFixed(2)));
    setTransactions((prev) => [
      {
        id: txId,
        date: new Date().toISOString().split('T')[0],
        description: `${description} • Split with ${friendHandle}`,
        bucket: 'Safe Spend Guardrail',
        type: 'PayPal P2P Split',
        amount: amount,
        status: 'Verified'
      },
      ...prev
    ]);
    triggerToast(
      `Guardrail Split Approved: £${amount.toFixed(2)} paid via PayPal`,
      `Request for £${amount.toFixed(2)} dispatched to ${friendHandle}. Safe spend preserved!`
    );
  };

  const handleCheckoutFull = ({ amount, description }) => {
    const txId = `PAY-${Math.floor(100000 + Math.random() * 900000)}F`;
    setLumpBalance((prev) => Math.max(0, +(prev - amount).toFixed(2)));
    setDailySafeSpend((prev) => Math.max(10, +(prev - 3.50).toFixed(2)));
    setTransactions((prev) => [
      {
        id: txId,
        date: new Date().toISOString().split('T')[0],
        description: `${description} • Paid in Full`,
        bucket: 'Direct Spend',
        type: 'PayPal Orders v2',
        amount: amount,
        status: 'Verified'
      },
      ...prev
    ]);
    triggerToast(
      `Paid £${amount.toFixed(2)} via PayPal`,
      'Daily safe-spend auto-adjusted by -£3.50/day over the next 3 days.'
    );
  };

  // Spreadsheet Ingestion Handler
  const handleSpreadsheetImportComplete = (data) => {
    if (data.lumpBalance) setLumpBalance(data.lumpBalance);
    if (data.dailySafeSpend) setDailySafeSpend(data.dailySafeSpend);
    if (data.buckets && data.buckets.length > 0) {
      setBuckets((prev) => [...data.buckets, ...prev]);
    }
    if (data.transactions && data.transactions.length > 0) {
      setTransactions((prev) => [...data.transactions, ...prev]);
    }
    triggerToast(
      'Budget Spreadsheet Ingested!',
      data.summary || 'Able AI successfully calibrated your account from your existing budget.'
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] font-sans flex flex-col selection:bg-teal-500/20">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        navItems={navItems}
      />

      {/* Top Navigation Bar with Experience Switcher */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        navItems={navItems}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        appMode={appMode}
        onChangeAppMode={setAppMode}
        onOpenCheckoutDemo={() => setIsCheckoutDemoOpen(true)}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
        onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
        onSimulateOpenBanking={() => handleSimulateOpenBankingSpend('Pret A Manger', 3.80)}
      />

      {/* ===================================================================== */}
      {/* EXPERIENCE 1: STANDALONE ABLE AI APPLICATION                          */}
      {/* ===================================================================== */}
      {appMode === 'standalone' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
          {/* KPI Top Cards */}
          <KpiCards
            lumpBalance={lumpBalance}
            dailySafeSpend={dailySafeSpend}
            totalSavedInBuckets={totalSavedInBuckets}
            bucketCount={buckets.length}
            groupGoals={groupGoals}
          />

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <BehaviouralNudge
                nudge={currentNudge}
                isAnalyzing={isAnalyzing}
                onRunAnalysis={handleRunNewAnalysis}
                onOpenCheckout={openPayPalCheckout}
                onOpenCopilot={() => setIsCopilotOpen(true)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <SavingsBuckets
                    buckets={buckets}
                    onOpenCheckout={openPayPalCheckout}
                    onNavigateToBucketsTab={() => setActiveTab('buckets')}
                    isFullView={false}
                  />
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <GroupGoals
                    groupGoals={groupGoals}
                    onOpenCheckout={openPayPalCheckout}
                    onInviteFriend={handleInviteFriend}
                    onTriggerPayout={handleTriggerGroupPayout}
                    onNavigateToGroupsTab={() => setActiveTab('groups')}
                    isFullView={false}
                  />
                </div>
              </div>

              <LiveLedger
                transactions={transactions}
                isCompact={true}
                onNavigateToLedger={() => setActiveTab('ledger')}
              />
            </div>
          )}

          {/* TAB 2: SAVINGS BUCKETS */}
          {activeTab === 'buckets' && (
            <SavingsBuckets
              buckets={buckets}
              onOpenCheckout={openPayPalCheckout}
              onOpenNewBucketModal={() => setShowNewBucketModal(true)}
              isFullView={true}
            />
          )}

          {/* TAB 3: GROUP GOALS */}
          {activeTab === 'groups' && (
            <GroupGoals
              groupGoals={groupGoals}
              onOpenCheckout={openPayPalCheckout}
              onInviteFriend={handleInviteFriend}
              onTriggerPayout={handleTriggerGroupPayout}
              isFullView={true}
            />
          )}

          {/* TAB 4: LIVE LEDGER (POWERED BY AG GRID) */}
          {activeTab === 'ledger' && (
            <LiveLedger
              transactions={transactions}
              isCompact={false}
            />
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* EXPERIENCE 2: ABLE AI AS AN EMBEDDED WIDGET INSIDE PAYPAL MOBILE APP  */}
      {/* ===================================================================== */}
      {appMode === 'paypal_mobile' && (
        <div className="flex-1 animate-in fade-in duration-300">
          <PayPalMobileAppView
            lumpBalance={lumpBalance}
            dailySafeSpend={dailySafeSpend}
            buckets={buckets}
            transactions={transactions}
            nudge={currentNudge}
            onOpenCheckout={openPayPalCheckout}
            onOpenCopilot={() => setIsCopilotOpen(true)}
            onSwitchToStandalone={() => setAppMode('standalone')}
            isProcessing={isProcessingPayPal}
          />
        </div>
      )}

      {/* Interactive PayPal Sandbox Checkout Modal */}
      <PayPalModal
        modalData={paypalModal}
        isProcessing={isProcessingPayPal}
        lumpBalance={lumpBalance}
        onCompletePayment={handleCompletePayPalPayment}
        onClose={() => setPaypalModal(null)}
      />

      {/* Agentic Copilot Chat Drawer */}
      <AgentCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        financialContext={{
          lumpBalance,
          dailySafeSpend,
          buckets,
          groupGoals
        }}
        onTriggerAction={handleCopilotAction}
      />

      {/* Create Bucket Modal */}
      <CreateBucketModal
        isOpen={showNewBucketModal}
        onClose={() => setShowNewBucketModal(false)}
        onCreateBucket={handleCreateBucket}
      />

      {/* Merchant Checkout Guardrail Simulation Modal */}
      <PayPalCheckoutSimulationModal
        isOpen={isCheckoutDemoOpen}
        onClose={() => setIsCheckoutDemoOpen(false)}
        dailySafeSpend={dailySafeSpend}
        onApplySplit={handleCheckoutSplit}
        onProceedFull={handleCheckoutFull}
      />

      {/* Embed Code Modal */}
      <EmbedCodeModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />

      {/* Spreadsheet Import Modal */}
      <SpreadsheetImportModal
        isOpen={isSpreadsheetModalOpen}
        onClose={() => setIsSpreadsheetModalOpen(false)}
        onImportComplete={handleSpreadsheetImportComplete}
      />

      {/* Global Toast */}
      <Toast toast={toast} />
    </div>
  );
}
