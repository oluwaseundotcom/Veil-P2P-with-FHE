
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'architecture';
  onViewChange: (view: 'dashboard' | 'architecture') => void;
  username: string;
  onLogout: () => void;
}

const VeilLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="50%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path 
      d="M50 5 L15 25 C15 55 25 85 50 110 C75 85 85 55 85 25 L50 5Z" 
      stroke="url(#logo-grad)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#glow)"
    />
    <path 
      d="M35 35 Q50 30 65 35 Q60 55 50 85 Q40 55 35 35Z" 
      fill="url(#logo-grad)" 
      fillOpacity="0.3"
    />
    <path 
      d="M35 35 C45 50 55 50 65 35" 
      stroke="url(#logo-grad)" 
      strokeWidth="2" 
      opacity="0.6"
    />
  </svg>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, username, onLogout }) => {
  const [account] = useState<string>("0x71C2607590022425000000000000000000004f21"); 
  const [network] = useState<string>("Veil Mainnet");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans tracking-wide">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onViewChange('dashboard')}>
            <div className="flex items-center gap-4">
              <VeilLogo className="h-10 w-auto drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] group-hover:scale-110 transition-transform duration-500" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-display font-black tracking-[0.2em] text-white leading-none glow-text">
                  VEIL
                </h1>
                <span className="text-indigo-500 text-[9px] font-bold tracking-[0.3em] uppercase opacity-80 mt-1">
                  Confidential p2p
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden lg:flex gap-2">
              <button 
                onClick={() => onViewChange('dashboard')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${currentView === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Interface
              </button>
              <button 
                onClick={() => onViewChange('architecture')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${currentView === 'architecture' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Architecture
              </button>
            </nav>

            <div className="hidden md:block h-8 w-[1px] bg-slate-800"></div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-4 p-2 pl-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group relative"
              >
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    {network}
                  </span>
                  <span className="text-xs text-slate-100 font-display font-bold">@{username}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-900 shadow-lg group-hover:rotate-6 transition-transform flex items-center justify-center border border-white/10 relative">
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                   {copied ? (
                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                   ) : (
                     <span className="text-[10px] font-black text-white/60">SCA</span>
                   )}
                </div>
                {copied && (
                  <div className="absolute -bottom-10 right-0 bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest animate-in fade-in zoom-in slide-in-from-top-2">
                    Address Copied
                  </div>
                )}
              </button>

              <button 
                onClick={onLogout}
                className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/30 transition-all group"
                title="Logout"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-slate-900 py-12 bg-slate-950">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
             <VeilLogo className="h-8 w-auto opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
          </div>
          <p className="text-slate-600 text-xs tracking-mysterious uppercase mb-2">Non-Custodial Passkey Infrastructure</p>
          <p className="text-slate-700 text-[10px]">© 2024 Veil. Protected by Zama fhEVM & Hardware Biometrics.</p>
        </div>
      </footer>
    </div>
  );
};
