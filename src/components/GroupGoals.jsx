import React, { useState } from 'react';
import { Send, AtSign, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GroupGoals({
  groupGoals = [],
  onOpenCheckout,
  onInviteFriend,
  onTriggerPayout,
  onNavigateToGroupsTab,
  isFullView = false
}) {
  const [friendInputs, setFriendInputs] = useState({});

  const handleInvite = (goalId) => {
    const input = friendInputs[goalId];
    if (input && input.trim()) {
      onInviteFriend(goalId, input.trim());
      setFriendInputs((prev) => ({ ...prev, [goalId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {isFullView && (
        <div>
          <h2 className="text-2xl font-black text-[#0A1628]">Collaborative Group Goals</h2>
          <p className="text-sm text-slate-500">
            Add friends via PayPal username, track split contributions, and execute automated PayPal Payouts at 100%.
          </p>
        </div>
      )}

      {!isFullView && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-[#0A1628]">Collaborative Group Goals</h3>
            <p className="text-xs text-slate-500 font-medium">
              Invite friends by PayPal username & pool funds
            </p>
          </div>
          {onNavigateToGroupsTab && (
            <button
              onClick={onNavigateToGroupsTab}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Open Pools <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className={`grid gap-6 ${isFullView ? 'grid-cols-1 lg:grid-cols-2' : 'space-y-4'}`}>
        {groupGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const isComplete = goal.current >= goal.target;

          if (!isFullView) {
            // Compact Overview Card
            return (
              <div
                key={goal.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {goal.members.length} PayPal Members
                    </span>
                    <h4 className="font-extrabold text-base text-[#0A1628] mt-1">
                      {goal.name}
                    </h4>
                    <p className="text-xs text-slate-500">{goal.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-base text-teal-600">
                      £{goal.current.toFixed(0)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      / £{goal.target.toFixed(0)} ({pct}%)
                    </p>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {goal.members.map((m) => (
                      <span
                        key={m.handle}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700"
                      >
                        {m.handle}
                      </span>
                    ))}
                  </div>

                  {isComplete ? (
                    <button
                      onClick={() => onTriggerPayout(goal)}
                      disabled={goal.payoutTriggered}
                      className="text-xs font-extrabold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 flex items-center gap-1 shadow-sm"
                    >
                      <Send className="w-3 h-3" />
                      {goal.payoutTriggered ? 'Payout Disbursed' : 'Trigger PayPal Payout'}
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenCheckout(50, goal.id, goal.name, 'group')}
                      className="text-xs font-extrabold px-3.5 py-1.5 rounded-lg bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087]"
                    >
                      Contribute £50
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // Full View Detailed Card
          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      PayPal Shared Pool
                    </span>
                    <h3 className="text-2xl font-black text-[#0A1628] mt-2">{goal.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{goal.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-teal-600">
                      £{goal.current.toFixed(2)}
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                      Target: £{goal.target.toFixed(2)} ({pct}%)
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Member List */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Contributors ({goal.members.length})
                    </p>
                    {isComplete && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Ready for Payout
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {goal.members.map((member) => (
                      <div
                        key={member.handle}
                        className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 text-white text-[10px] font-black flex items-center justify-center uppercase">
                          {member.handle.replace('@', '').slice(0, 2)}
                        </div>
                        <span className="text-xs font-bold text-[#0A1628]">
                          {member.handle}
                        </span>
                        <span className="text-[11px] font-semibold text-teal-600">
                          (£{member.paid})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Add Friend by PayPal Username */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="relative flex-1">
                      <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter PayPal handle (e.g. sarah_j)"
                        value={friendInputs[goal.id] || ''}
                        onChange={(e) =>
                          setFriendInputs((prev) => ({
                            ...prev,
                            [goal.id]: e.target.value
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleInvite(goal.id);
                        }}
                        className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <button
                      onClick={() => handleInvite(goal.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#0A1628] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-teal-400" /> Invite
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onOpenCheckout(50, goal.id, goal.name, 'group')}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-[#FFC439] hover:bg-[#F4BB33] text-[#003087] font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="italic font-black text-base">
                    Pay<span className="text-[#0079C1]">Pal</span>
                  </span>
                  <span>• Contribute £50.00</span>
                </button>

                {isComplete && (
                  <button
                    onClick={() => onTriggerPayout(goal)}
                    disabled={goal.payoutTriggered}
                    className="py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {goal.payoutTriggered ? 'Payout Sent' : 'Trigger PayPal Payout'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
