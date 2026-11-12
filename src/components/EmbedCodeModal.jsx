import React, { useState } from 'react';
import { X, Copy, Check, Code, Puzzle, Layers } from 'lucide-react';

export default function EmbedCodeModal({ isOpen, onClose }) {
  const [activeFormat, setActiveFormat] = useState('iframe');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const snippets = {
    iframe: `<!-- Able AI Embedded PayPal Widget (Iframe) -->
<iframe
  src="https://able-ai.dev/widget?currency=GBP&theme=paypal"
  width="380"
  height="480"
  style="border: none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);"
  title="Able AI PayPal Widget">
</iframe>`,
    script: `<!-- Able AI Web Component Embed -->
<script
  src="https://cdn.able-ai.dev/widget.js"
  data-paypal-client-id="YOUR_PAYPAL_SANDBOX_CLIENT_ID"
  async>
</script>

<able-ai-guardrail
  theme="paypal-light"
  currency="GBP"
  user-handle="@alex_m">
</able-ai-guardrail>`,
    react: `// React / Next.js Integration
import { AblePayPalWidget } from '@able-ai/paypal-widget';

export function PayPalDashboard() {
  return (
    <div className="paypal-sidebar">
      <AblePayPalWidget
        dailySafeSpend={34.50}
        currency="GBP"
        onSweep={(order) => console.log('PayPal Order Executed:', order)}
      />
    </div>
  );
}`
  };

  const currentCode = snippets[activeFormat];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1628]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0A1628] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Embed Able AI Widget</h3>
              <p className="text-xs text-slate-400">Drop-in financial guardrail for PayPal or any commerce site</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Format Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveFormat('iframe')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFormat === 'iframe' ? 'bg-white text-[#0A1628] shadow-sm' : 'text-slate-600 hover:text-[#0A1628]'
              }`}
            >
              HTML Iframe
            </button>
            <button
              onClick={() => setActiveFormat('script')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFormat === 'script' ? 'bg-white text-[#0A1628] shadow-sm' : 'text-slate-600 hover:text-[#0A1628]'
              }`}
            >
              Web Component
            </button>
            <button
              onClick={() => setActiveFormat('react')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFormat === 'react' ? 'bg-white text-[#0A1628] shadow-sm' : 'text-slate-600 hover:text-[#0A1628]'
              }`}
            >
              React / Next.js
            </button>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
              <code>{currentCode}</code>
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 leading-relaxed">
            💡 <strong>Integration Note:</strong> When embedded, the widget auto-authenticates via PayPal OAuth2 token and surfaces velocity nudges directly at checkout or inside customer portals.
          </div>
        </div>
      </div>
    </div>
  );
}
