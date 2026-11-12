import React from 'react';

export default function AbleLogo({ showSubtitle = false, lightText = false }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0">
        <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ableGrad1" x1="12" y1="52" x2="48" y2="12" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#2DD4BF" />
            </linearGradient>
            <linearGradient id="ableGrad2" x1="28" y1="16" x2="50" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          {/* Left & Right legs of the 'A' */}
          <path
            d="M16 50L30 16C31.2 13.2 34.8 13.2 36 16L48 48"
            stroke="url(#ableGrad2)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Upward-sweeping arrow crossbar */}
          <path
            d="M11 42C22 40 36 33 49 17"
            stroke="url(#ableGrad1)"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M39 16H50V27"
            stroke="#2DD4BF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className={`text-xl font-black tracking-tight ${lightText ? 'text-white' : 'text-[#0A1628]'}`}>
            ABLE
          </span>
          <span className="text-xl font-light tracking-wide text-teal-500">AI</span>
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-slate-400 mt-1">
            Turning little habits into big benefits
          </span>
        )}
      </div>
    </div>
  );
}
