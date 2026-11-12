/**
 * Google Gemini AI Integration Service
 * Powers:
 * 1. Behavioural Nudge Engine (Velocity analysis, surplus detection, micro-habit recommendations)
 * 2. Able Agentic Copilot (Interactive financial advisor with autonomous action dispatch)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Generate Behavioural Nudge using Gemini AI
 */
export async function analyzeSpendingWithGemini({
  lumpBalance = 2450.00,
  dailySafeSpend = 34.50,
  buckets = [],
  transactions = [],
  daysRemaining = 24
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const prompt = `You are the core behavioural economics engine for Able AI, an autonomous financial co-pilot for young adults and students.
Analyze the user's financial state:
- Current Lump Balance: £${lumpBalance.toFixed(2)}
- Current Daily Safe-Spend Ceiling: £${dailySafeSpend.toFixed(2)} / day
- Days remaining until next income tranche: ${daysRemaining} days
- Savings Buckets: ${JSON.stringify(buckets.map(b => ({ name: b.name, current: b.current, target: b.target })))}
- Recent Transactions: ${JSON.stringify(transactions.slice(0, 5).map(t => ({ desc: t.description, amount: t.amount, type: t.type })))}

Task: Detect a spending micro-habit or surplus opportunity. Formulate a gentle, motivating micro-transfer recommendation into one of their buckets or group goals.
Respond ONLY with a valid JSON object matching this schema:
{
  "badge": "Short badge (e.g. 'Surplus Detected' or 'Micro-Habit Opportunity')",
  "headline": "Compelling 1-sentence headline with exact £ amount",
  "rationale": "2-sentence behavioural rationale explaining how cooking at home, skipping an impulse buy, or spending velocity allows this without hurting their daily safe-spend.",
  "amount": 25.00,
  "targetName": "Name of one of their buckets or goals",
  "targetType": "bucket",
  "safeSpendAdjustment": "Maintains £34.50/day safe ceiling"
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json"
            }
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            ...parsed,
            source: 'live_gemini_api'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', err.message);
    }
  }

  // Intelligent Heuristic Behavioural Engine (Deterministic fallback for instant demo testing)
  const scenarios = [
    {
      badge: 'Surplus Detected',
      headline: 'You are £25.00 under your daily safe-spend limit today.',
      rationale:
        'By skipping takeaway coffee and cooking at home over the last 48 hours, you created a safe cash-flow cushion without affecting your £34.50/day guardrail.',
      amount: 25.00,
      targetName: 'Emergency Buffer',
      targetType: 'bucket',
      safeSpendAdjustment: 'Leaves £33.80/day safe ceiling',
      source: 'heuristic_engine'
    },
    {
      badge: 'Group Milestone Alert',
      headline: 'Ibiza Summer Trip is just £50.00 away from 100% funded!',
      rationale:
        'Your lump balance has a projected £110 surplus before next month’s rent cycle. Completing this goal unlocks instant PayPal Payout distribution to @sarah_j.',
      amount: 50.00,
      targetName: 'Ibiza Summer Trip',
      targetType: 'group',
      safeSpendAdjustment: 'Projected cushion: +£110.00',
      source: 'heuristic_engine'
    },
    {
      badge: 'Micro-Habit Opportunity',
      headline: 'Boost MacBook Pro Upgrade with a £15.00 weekend sweep.',
      rationale:
        'Consistent £15 micro-transfers every Thursday puts you 6 weeks ahead of your target date while keeping your daily spend ceiling intact.',
      amount: 15.00,
      targetName: 'MacBook Pro Upgrade',
      targetType: 'bucket',
      safeSpendAdjustment: 'Safe spend impact: < £0.50/day',
      source: 'heuristic_engine'
    }
  ];

  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

/**
 * Able Agentic Copilot Chat
 * Understands natural language queries & generates executable PayPal micro-actions.
 */
export async function chatWithAbleCopilot({
  message,
  history = [],
  financialContext = {}
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const prompt = `You are Able AI, an autonomous financial co-pilot designed for student and young adult cash-flow management.
Financial context:
- Current Lump Balance: £${financialContext.lumpBalance || 2450}
- Daily Safe-Spend Limit: £${financialContext.dailySafeSpend || 34.50}
- Buckets: ${JSON.stringify(financialContext.buckets || [])}

User message: "${message}"

You must answer concisely, friendly, and empowering.
If the user is asking to save money, check affordability, or move funds, you can suggest an actionable PayPal sweep.
Respond in JSON:
{
  "reply": "Your conversational answer here.",
  "action": null OR {
    "type": "PAYPAL_SWEEP",
    "amount": 20,
    "targetName": "Emergency Buffer",
    "targetType": "bucket"
  }
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.4,
              responseMimeType: "application/json"
            }
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text);
        }
      }
    } catch (err) {
      console.warn('Gemini Copilot API error:', err.message);
    }
  }

  // Heuristic Agentic Copilot logic
  const lower = (message || '').toLowerCase();

  if (lower.includes('dinner') || lower.includes('eat out') || lower.includes('food')) {
    return {
      reply: `Your daily safe spend limit is £${financialContext.dailySafeSpend || 34.50}. A £20-£25 dinner is completely within your safe guardrail! If you keep it under £25, we can auto-sweep the remaining £9.50 into your MacBook Pro goal.`,
      action: {
        type: 'PAYPAL_SWEEP',
        amount: 10.00,
        targetName: 'MacBook Pro Upgrade',
        targetType: 'bucket'
      }
    };
  }

  if (lower.includes('emergency') || lower.includes('buffer') || lower.includes('save 20')) {
    return {
      reply: `Great micro-habit move! Moving £20 into your Emergency Buffer will bring it to £460.00 (46% funded) while keeping your daily safe-spend healthy. I've prepared the PayPal order for you below:`,
      action: {
        type: 'PAYPAL_SWEEP',
        amount: 20.00,
        targetName: 'Emergency Buffer',
        targetType: 'bucket'
      }
    };
  }

  if (lower.includes('ibiza') || lower.includes('trip') || lower.includes('group')) {
    return {
      reply: `Your Ibiza Summer Trip pool is at £1,150 / £1,200. Just £50 left! Once the remaining £50 is contributed, Able AI can automatically disburse the funds to @sarah_j via the PayPal Payouts API.`,
      action: {
        type: 'PAYPAL_SWEEP',
        amount: 50.00,
        targetName: 'Ibiza Summer Trip',
        targetType: 'group'
      }
    };
  }

  return {
    reply: `You're tracking comfortably! With £${(financialContext.lumpBalance || 2450).toFixed(2)} remaining and a £${(financialContext.dailySafeSpend || 34.50).toFixed(2)} daily safe-spend ceiling, your cash velocity is well-balanced. Would you like me to sweep £15 from your predicted weekend surplus into your savings?`,
    action: {
      type: 'PAYPAL_SWEEP',
      amount: 15.00,
      targetName: 'Emergency Buffer',
      targetType: 'bucket'
    }
  };
}
