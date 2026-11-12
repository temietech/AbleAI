# Able AI — Autonomous Finance & Micro-Habit Savings

> Built for the **PayPal AI Hackathon** (Devpost)  
> Combining **PayPal Developer Platform (Sandbox Orders & Payouts)**, **Google Gemini AI**, and **AG Grid Data Ledger**.

---

## 💡 Overview & Problem Statement

Students, gig economy workers, and young professionals often receive income in **periodic lump sums** (e.g., student loans, maintenance grants, freelance contracts). Without continuous guidance, early-period overspending frequently leaves users struggling toward the end of the payment cycle.

**Able AI** solves this with an **autonomous behavioural finance engine**:
1. **Dynamic Daily Safe-Spend**: Calculates daily spending ceilings based on remaining days, committed bills, and spending velocity.
2. **Autonomous Savings Buckets**: Turns small daily surpluses into dedicated cushions (Emergency Buffer, Tech upgrades, Wealth) with 1-click PayPal micro-transfers.
3. **Collaborative Group Goals**: Allows roommates or friends to pool money for shared expenses via PayPal usernames, triggering automated **PayPal Payouts** once 100% funded.
4. **Agentic Copilot**: An interactive AI financial assistant powered by Google Gemini that analyzes cash flow and proposes actionable PayPal transfer directives in real time.
5. **Live Audit Ledger**: An enterprise-grade transactional ledger powered by **AG Grid**, tracking every order creation, capture, and payout disbursement.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, AG Grid Community (`ag-grid-react`)
- **Backend API**: Node.js, Express, REST APIs
- **PayPal Integration**:
  - `POST /v1/oauth2/token` — Secure OAuth2 token exchange
  - `POST /v2/checkout/orders` — Orders v2 API order generation
  - `POST /v2/checkout/orders/{id}/capture` — Order capture and ledger verification
  - `POST /v1/payments/payouts` — Payouts API disbursement for completed group pools
- **AI Integration**:
  - Google Gemini 1.5/2.0 API for real-time velocity reasoning and structured JSON nudges
  - Heuristic fallback engine ensures full offline responsiveness during local judging

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/your-username/able-ai.git
cd able-ai
npm install
```

### 3. Environment Configuration (Optional for Live API Calls)
Create a `.env` file from the example template:
```bash
cp .env.example .env
```

Edit `.env` to include your credentials:
```env
PORT=5000
PAYPAL_MODE=sandbox
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_CLIENT_SECRET
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-1.5-flash
```

> **Note for Judges**: Even without API credentials configured, Able AI includes a complete sandbox simulation mode that executes the exact API workflows, order captures, and payouts with zero friction.

### 4. Run the Full-Stack Application
Start both the Express backend API and the Vite frontend concurrently:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌟 Key Features Walkthrough

### 1. Gemini Behavioural Nudge Engine
- Analyzes lump balance, remaining cycle days, and recent transaction history.
- Calculates micro-surpluses and displays targeted recommendations with one-click PayPal checkout.
- Recalculates dynamically with the "Recalculate AI" button.

### 2. Autonomous Savings Buckets
- Target-based goals with automated micro-saving rules (sweeps, roundups).
- One-click "+ Quick Fund £20 via PayPal" or "+£10 Micro-Habit".
- New buckets can be created dynamically and linked immediately.

### 3. Collaborative Social Finance (PayPal Group Pools)
- Group goals (e.g., Ibiza Summer Trip, Flatmate Bills Pool).
- Real-time contributor addition by PayPal username handle.
- Automated **PayPal Payouts API** execution when the target is reached.

### 4. Able AI Copilot (Agentic Commerce)
- Interactive slide-out chat drawer.
- Users can ask questions like *"Can I afford dinner tonight for £25?"* or *"Save £20 to my Emergency Buffer"*.
- The agent formulates executable PayPal micro-actions right inside the chat window.

### 5. AG Grid Live Financial Ledger (Sponsor Prize Contender)
- Real-time audit log with search, column filtering, sorting, custom status badges, and CSV export.
- Demonstrates advanced AG Grid capabilities for enterprise financial reconciliation.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
