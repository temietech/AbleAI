# Devpost Submission Guide for Able AI

---

### 1. Project Title
**Able AI — Autonomous Finance & Micro-Habit Savings**

### 2. Elevator Pitch / Tagline (Under 200 characters)
> Turning little habits into big benefits: Autonomous cash-velocity guardrails & micro-savings powered by PayPal Sandbox and Google Gemini AI.

---

### 3. Submission Story / Description (Markdown for Devpost "About" field)

## 💡 Inspiration
Students, gig economy workers, and young professionals often receive income in **periodic lump sums** (such as student loans, quarterly grants, or freelance payouts). A well-documented behavioural phenomenon is that early-cycle spending velocity is unsustainably high, leading to severe financial anxiety and empty balances in the final weeks of the term.

Traditional budgeting tools are passive—they tell you what you spent *after* the damage is done. Furthermore, people who already invested time building traditional spreadsheets in Excel or Google Sheets face high switching friction and think: *"I already have a budget spreadsheet; I don't want to start over from scratch."*

We built **Able AI** to turn passive financial tracking into **autonomous, proactive financial guardrails** powered by PayPal's developer platform and Google Gemini AI—complete with instant spreadsheet ingestion so users can migrate in seconds without losing their existing setup.

---

## 🚀 What It Does

Able AI operates in **two distinct modalities** to meet users wherever they interact with money:

### Modality 1: Standalone Autonomous Finance Hub
- **Dynamic Daily Safe-Spend Ceiling**: Continuously calculates a daily spending limit based on remaining days in the cycle, committed bills, and cash flow velocity.
- **Smart Spreadsheet Ingestion (Excel / CSV / Google Sheets)**: Users can upload their existing budget spreadsheet. Gemini AI parses their columns, identifies fixed expenses and savings targets, automatically sets up their savings buckets, and calibrates their daily safe spend so they never start from scratch.
- **Autonomous Savings Buckets**: Turns small daily surpluses into dedicated cushions (Emergency Buffer, Tech upgrades, Wealth) with one-click PayPal micro-transfers.
- **Collaborative Social Pools**: Group goals (e.g., student trips, flatmate bills) where members contribute via their PayPal handles. When the pool hits 100%, Able AI automatically disburses funds to the organizer using the **PayPal Payouts API**.
- **Able AI Copilot (Agentic Commerce)**: An interactive conversational AI assistant that understands cash flow context, assesses whether a purchase is safe, and formulates executable PayPal sweep orders right inside the chat window.
- **AG Grid Live Financial Ledger**: Enterprise-grade transaction grid with real-time search, multi-column filtering, sorting, and CSV export.

### Modality 2: Embedded Widget Inside the PayPal Mobile App
- **Native Mobile Widget**: Embedded directly on the PayPal Mobile Home Feed beneath the user's PayPal balance.
- **Velocity Ring & Surplus Nudge**: Shows the user their safe-spend limit at a glance whenever they open PayPal.
- **1-Tap PayPal Balance Sweeps**: Allows users to route small micro-surpluses (e.g. £10 or £15) into their savings buckets with zero friction.
- **Point-of-Sale Checkout Guardrail**: Simulates merchant checkouts where Able AI detects if a planned purchase exceeds today's safe spend limit, recommending intelligent actions (like splitting 50/50 with a friend via PayPal P2P) before payment completion.

---

## 🛠️ How We Built It

- **PayPal Developer Platform (Sandbox)**:
  - `POST /v1/oauth2/token` for secure authentication.
  - `POST /v2/checkout/orders` & `POST /v2/checkout/orders/{id}/capture` for micro-transfers and bucket sweeps.
  - `POST /v1/payments/payouts` for automated group pool disbursements.
  - Complete fallback simulation engine ensuring judges can test the full transaction lifecycle without API keys.
- **Artificial Intelligence**:
  - **Google Gemini 1.5/2.0 API** for real-time velocity reasoning, surplus detection, smart spreadsheet ingestion, and agentic commerce dialogue.
- **Enterprise Data Grid**:
  - **AG Grid Community / React** (`ag-grid-react`) powering the Live Financial Ledger.
- **Full-Stack Architecture**:
  - **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
  - **Backend**: Node.js, Express REST API with CORS and environment variable security.

---

## 🧗 Challenges We Ran Into
1. **Designing for Dual Modalities**: Balancing a comprehensive desktop personal finance dashboard with an authentic, compact in-app widget inside the PayPal mobile app required careful responsive architecture and custom component isolation.
2. **Spreadsheet Ingestion Normalization**: Traditional user spreadsheets vary wildly in column naming and layout. We designed custom Gemini structured prompting to reliably extract lump balances, fixed bills, and targets into normalized schema objects.
3. **Agentic Commerce Guardrails**: Ensuring that the AI copilot does not simply generate static text, but formulates structured, executable payment payloads that seamlessly link to the PayPal Orders API.
4. **Resilient Sandbox Experience**: Building a dual-layer client that seamlessly calls live PayPal Sandbox endpoints when credentials are provided while maintaining 100% functionality in offline/simulated mode so hackathon judges can review effortlessly.

---

## 🏆 Accomplishments That We're Proud Of
- A truly working full-stack implementation with both frontend and backend communicating live.
- End-to-end integration of both PayPal Orders v2 and PayPal Payouts v1 APIs.
- Zero-friction spreadsheet onboarding allowing Excel/Sheets users to migrate in seconds.
- A photorealistic PayPal mobile app simulator with an embedded Able AI widget card.
- Enterprise-grade AG Grid audit ledger with instant search, sorting, and CSV export.

---

## 📚 What We Learned
- How to structure agentic commerce workflows where AI suggestions transition into cryptographically verified PayPal transactions.
- How to leverage LLM document parsing to dissolve onboarding friction for spreadsheet power-users.

---

## 🔮 What's Next for Able AI
- Native browser extension to bring the Checkout Guardrail to any e-commerce site.
- Deep integration with PayPal Subscriptions API for recurring automated weekly sweeps.
- Multi-currency support across USD, EUR, and GBP with real-time FX conversion.

---

### 4. "Built With" Tags
`paypal`, `paypal-sandbox`, `gemini-api`, `google-gemini`, `react`, `vite`, `ag-grid`, `express`, `nodejs`, `tailwind-css`, `agentic-commerce`

### 5. Links
- **GitHub Repository**: https://github.com/temietech/AbleAI
- **License**: MIT License (included in repository)
