
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const VeilLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-grad-login" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="50%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <filter id="glow-login">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path 
      d="M50 5 L15 25 C15 55 25 85 50 110 C75 85 85 55 85 25 L50 5Z" 
      stroke="url(#logo-grad-login)" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#glow-login)"
    />
    <path 
      d="M35 35 Q50 30 65 35 Q60 55 50 85 Q40 55 35 35Z" 
      fill="url(#logo-grad-login)" 
      fillOpacity="0.3"
    />
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsAuthenticating(true);
    setAuthStep(1);

    // Simulate Biometric Flow
    setTimeout(() => setAuthStep(2), 1000);
    setTimeout(() => setAuthStep(3), 2200);
    setTimeout(() => {
      onLogin(username.replace('@', ''));
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex justify-center mb-6">
            <VeilLogo className="h-24 w-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
          </div>
          <h1 className="text-5xl font-display font-black tracking-[0.3em] text-white uppercase glow-text mb-2">VEIL</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Confidential Finance Protocol</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-10 rounded-[40px] shadow-2xl backdrop-blur-xl mysterious-border">
          {!isAuthenticating ? (
            <form onSubmit={handleLogin} className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Handle</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 font-bold">@</span>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username" 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-10 pr-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium placeholder:text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-display font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-mysterious text-xs flex items-center justify-center gap-3 group"
                >
                  <span>Initialize Session</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest font-bold px-4 leading-relaxed">
                  Your hardware security module will secure your FHE keys
                </p>
              </div>
            </form>
          ) : (
            <div className="py-10 text-center space-y-8 animate-in fade-in duration-500">
              <div className="relative flex justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                  <div className={`absolute inset-0 border-t-2 border-indigo-400 rounded-full animate-spin duration-700`}></div>
                  <svg className={`w-10 h-10 ${authStep >= 2 ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.234 3.41.659m-4.74 4.892A1 1 0 0011 9h4a1 1 0 00.993-.883L16 8l-.007-.117A1 1 0 0015 7h-4a1 1 0 00-1 1l.007.117a1 1 0 00.993.883zM11 12v1m0 4v1m4-5v1m0 4v1" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white font-display font-bold text-sm tracking-widest uppercase">
                  {authStep === 1 && "Requesting Passkey..."}
                  {authStep === 2 && "Verifying Biometrics..."}
                  {authStep === 3 && "Vault Sync Successful"}
                </p>
                <div className="flex justify-center gap-1">
                   {[1,2,3].map(i => (
                     <div key={i} className={`h-1 rounded-full transition-all duration-500 ${authStep >= i ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-800'}`}></div>
                   ))}
                </div>
              </div>
              
              <p className="text-[10px] text-slate-500 font-mono italic">
                {authStep === 1 && "Communicating with Secure Enclave..."}
                {authStep === 2 && `Validating @${username} credential...`}
                {authStep === 3 && "Accessing encrypted TFHE state..."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-slate-700 text-[10px] uppercase tracking-widest font-bold">Supported Hardware</p>
          <div className="flex justify-center gap-6 grayscale opacity-40">
             <span className="text-xs font-black text-white">Apple FaceID</span>
             <span className="text-xs font-black text-white">Android Bio</span>
             <span className="text-xs font-black text-white">YubiKey</span>
          </div>
        </div>
      </div>
    </div>
  );
};
