# Able AI — Autonomous Finance & Micro-Habit Savings

> Built for the **PayPal AI Hackathon** (Devpost)  
> Combining **PayPal Developer Platform (Sandbox Orders & Payouts)**, **Google Gemini AI**, and **AG Grid Data Ledger**.

---

## 💡 Overview & Dual-Persona Architecture

Students, gig economy workers, and young professionals often receive income in **periodic lump sums** (e.g., student loans, maintenance grants, freelance contracts). Without continuous guidance, early-period overspending frequently leaves users struggling toward the end of the payment cycle.

**Able AI** operates in **two distinct modalities**:

### 1. Standalone Autonomous Finance App
A dedicated personal finance portal featuring:
- **Dynamic Daily Safe-Spend**: Real-time spending velocity calculation that updates dynamically as expenses occur.
- **Autonomous Savings Buckets**: Automated micro-habits (sweeps, roundups) funded directly via PayPal Orders v2 API.
- **Collaborative Group Goals**: Shared pools with PayPal user handles and automated disbursement via the PayPal Payouts API.
- **Agentic AI Copilot**: Interactive Gemini-powered assistant capable of formulating executable PayPal payment directives.
- **AG Grid Live Financial Ledger**: Enterprise-grade transaction grid with multi-column filtering, search, and CSV export (qualifying for the **$5,000 AG Grid Sponsor Prize**).

### 2. Embedded Widget Inside PayPal & Checkout Guardrail
Able AI can be embedded directly into the **PayPal Customer Wallet / Dashboard** as a native mini-app:
- **In-Wallet Widget**: Sits right on the PayPal Dashboard (`paypal.com/myaccount`), letting users view their daily safe-spend ceiling and execute instant 1-click micro-sweeps using their PayPal balance without switching apps.
- **Point-of-Sale Checkout Guardrail**: Intercepts online merchant purchases via PayPal Checkout. If a purchase exceeds the user's daily safe spend, Able AI suggests agentic split options (e.g., "Split 50% with @maya_r via PayPal P2P") before payment authorization.
- **Embeddable Component**: Provides drop-in HTML Iframe, Web Component, and React snippets for fintech developers.

---

## 🛠️ Tech Stack & PayPal / AI Integration

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

### 3. Run the Full-Stack Application
Start both the Express backend API and the Vite frontend concurrently:
```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Experience Switcher
Use the top bar in the application to toggle between:
- **1. Standalone App**: The comprehensive personal finance hub.
- **2. Inside PayPal (Widget)**: The simulated PayPal Dashboard featuring the embedded Able AI widget.
- **Checkout Guardrail**: Test point-of-sale purchase interception.
- **Embed Code**: View embeddable Iframe and Web Component snippets.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
