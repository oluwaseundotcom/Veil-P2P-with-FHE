
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../services/supabase';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NIGERIAN_BANKS = [
  "Access Bank", "First Bank", "GTBank", "Kuda Bank", "OPay", "United Bank for Africa (UBA)", "Zenith Bank"
];

const NETWORKS = [
  { id: 'eth', name: 'Ethereum (Sepolia)', symbol: 'ETH', color: 'indigo', address: '0x71C2...4f21' },
  { id: 'trc', name: 'Tron (TRC20)', symbol: 'TRX', color: 'red', address: 'TY6vA...Xk92' },
  { id: 'bsc', name: 'Binance Smart Chain', symbol: 'BEP20', color: 'yellow', address: '0x71C2...4f21' },
  { id: 'sol', name: 'Solana (SPL)', symbol: 'SOL', color: 'cyan', address: '6xPqW...mZ3L' },
];

interface Transaction {
  id: number;
  type: string;
  amount: string;
  from?: string;
  to?: string;
  memo: string;
  status: string;
}

export const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<string>("4,250.00 cUSDT");
  const [isVaultPrivate, setIsVaultPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'withdraw'>('send');
  const [isBridging, setIsBridging] = useState(false);
  const [bridgeStep, setBridgeStep] = useState(0);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [isSigning, setIsSigning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bridgeCopied, setBridgeCopied] = useState(false);
  
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [txData, setTxData] = useState({ to: '', amount: '', memo: '' });
  const [withdrawData, setWithdrawData] = useState({ bank: '', accountNumber: '', amount: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [fheExplain, setFheExplain] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else if (data) {
      setHistory(data.map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        from: tx.from_user,
        to: tx.recipient,
        memo: tx.memo,
        status: tx.status
      })));
    }
    setLoading(false);
  };

  const updateTxStatus = async (id: any, status: string) => {
    setHistory(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
    
    // Update in Supabase
    await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id);
  };

  const startStatusFlow = (id: number) => {
    setTimeout(() => {
      updateTxStatus(id, 'Settling');
    }, 5000);
    setTimeout(() => {
      updateTxStatus(id, 'Completed');
    }, 10000);
  };

  const handleCopy = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const handleTogglePrivacy = async () => {
    if (!isVaultPrivate) {
      setIsVaultPrivate(true);
      setBalance("••••••••");
      if (!fheExplain) {
        const resp = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Explain briefly how Zama fhEVM handles client-side re-encryption using a Passkey-derived public key for viewing private state without revealing it to the validator.",
        });
        setFheExplain(resp.text || "");
      }
    } else {
      setIsVaultPrivate(false);
      setBalance("4,250.00 cUSDT");
    }
  };

  const simulatePasskey = () => {
    return new Promise((resolve) => {
      setIsSigning(true);
      setTimeout(() => {
        setIsSigning(false);
        resolve(true);
      }, 600);
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await simulatePasskey();
    setIsProcessing(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newTxData = {
      user_id: user.id,
      type: 'Out',
      amount: 'Encrypted',
      recipient: txData.to,
      memo: 'Encrypted',
      status: 'Sending'
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTxData])
      .select();

    if (error) {
      console.error('Error saving transaction:', error);
    } else if (data) {
      const insertedTx = data[0];
      const newTx: Transaction = { 
        id: insertedTx.id, 
        type: insertedTx.type, 
        amount: insertedTx.amount, 
        to: insertedTx.recipient, 
        memo: insertedTx.memo, 
        status: insertedTx.status 
      };
      
      setHistory(prev => [newTx, ...prev]);
      startStatusFlow(insertedTx.id);
    }
    
    setTimeout(() => {
      setTxData({ to: '', amount: '', memo: '' });
      setIsProcessing(false);
    }, 400);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    await simulatePasskey();
    setIsProcessing(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newTxData = {
      user_id: user.id,
      type: 'Withdraw',
      amount: 'Encrypted',
      recipient: withdrawData.bank,
      memo: 'NGN Bank Transfer',
      status: 'Sending'
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTxData])
      .select();

    if (error) {
      console.error('Error saving transaction:', error);
    } else if (data) {
      const insertedTx = data[0];
      const newTx: Transaction = { 
        id: insertedTx.id, 
        type: insertedTx.type, 
        amount: insertedTx.amount, 
        to: insertedTx.recipient, 
        memo: insertedTx.memo, 
        status: insertedTx.status 
      };
      
      setHistory(prev => [newTx, ...prev]);
      startStatusFlow(insertedTx.id);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setWithdrawData({ bank: '', accountNumber: '', amount: '' });
    }, 500);
  };

  const startBridge = () => {
    setIsBridging(true);
    setBridgeStep(1);
  };

  const nextBridgeStep = async () => {
    if (bridgeStep < 3) {
      setBridgeStep(bridgeStep + 1);
    } else {
      setIsBridging(false);
      setBridgeStep(0);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newTxData = {
        user_id: user.id,
        type: 'Bridge',
        amount: '100.00',
        from_user: selectedNetwork.name,
        memo: `USDT (${selectedNetwork.symbol}) -> cUSDT`,
        status: 'Sending'
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTxData])
        .select();

      if (error) {
        console.error('Error saving transaction:', error);
      } else if (data) {
        const insertedTx = data[0];
        const newTx: Transaction = { 
          id: insertedTx.id, 
          type: insertedTx.type, 
          amount: insertedTx.amount, 
          from: insertedTx.from_user, 
          memo: insertedTx.memo, 
          status: insertedTx.status 
        };
        
        setHistory(prev => [newTx, ...prev]);
        startStatusFlow(insertedTx.id);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
      {/* Passkey Overlay */}
      {isSigning && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.234 3.41.659m-4.74 4.892A1 1 0 0011 9h4a1 1 0 00.993-.883L16 8l-.007-.117A1 1 0 0015 7h-4a1 1 0 00-1 1l.007.117a1 1 0 00.993.883zM11 12v1m0 4v1m4-5v1m0 4v1" /></svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Biometric Verification</h3>
            <p className="text-slate-400 text-sm mb-6">Confirming identity with Veil Secure Enclave...</p>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {isBridging && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-xl w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <span className="text-9xl font-black">{selectedNetwork.symbol}</span>
            </div>
            <button onClick={() => setIsBridging(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white z-20">✕</button>
            <h2 className="text-xl font-display font-bold uppercase tracking-mysterious mb-6 text-indigo-400">Bridge: Multi-Chain Inflow</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2 space-y-4">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Source</p>
                 <div className="space-y-2">
                    {NETWORKS.map(net => (
                      <button 
                        key={net.id}
                        onClick={() => { setSelectedNetwork(net); setBridgeStep(1); }}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${selectedNetwork.id === net.id ? 'bg-indigo-600/10 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                      >
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold ${selectedNetwork.id === net.id ? 'text-indigo-400' : 'text-slate-500'}`}>
                             {net.symbol[0]}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-xs font-bold text-white">{net.name}</span>
                             <span className="text-[9px] text-slate-500 uppercase tracking-tighter">{net.symbol} Network</span>
                           </div>
                        </div>
                        {selectedNetwork.id === net.id && <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)]"></div>}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="md:col-span-3 space-y-8 flex flex-col justify-between">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Secured Vault Address</p>
                    <div className="flex items-center justify-between gap-4">
                        <code className="text-xs font-mono text-indigo-300 break-all">{selectedNetwork.address}</code>
                        <button 
                            onClick={() => handleCopy(selectedNetwork.address, setBridgeCopied)}
                            className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white shrink-0"
                        >
                            {bridgeCopied ? '✅' : '📋'}
                        </button>
                    </div>
                    <p className="mt-4 text-[9px] text-slate-600 italic">Transfer USDT on {selectedNetwork.name} to this address. Our relayer will lock and mint encrypted cUSDT to your @handle.</p>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between relative px-2">
                        {[1, 2, 3].map((s) => (
                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all z-10 ${bridgeStep >= s ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                            {s}
                        </div>
                        ))}
                        <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-800 -z-0"></div>
                        <div className="absolute top-4 left-0 h-0.5 bg-indigo-600 transition-all -z-0" style={{ width: `${((bridgeStep-1)/2)*100}%` }}></div>
                    </div>

                    <div className="min-h-[80px] flex flex-col justify-center text-center px-4">
                        {bridgeStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-slate-200 text-sm font-bold mb-1">Authorization</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Initializing Secure Bridging on {selectedNetwork.symbol}</p>
                        </div>
                        )}
                        {bridgeStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-slate-200 text-sm font-bold mb-1">Proof of Lock</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Securing your cross-chain asset metadata</p>
                        </div>
                        )}
                        {bridgeStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-emerald-400 text-sm font-bold mb-1">Minting Encrypted</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">Finalizing TFHE conversion in Veil Mainnet</p>
                        </div>
                        )}
                    </div>

                    <button 
                        onClick={nextBridgeStep}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-display font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/30 uppercase tracking-mysterious text-xs"
                    >
                        {bridgeStep === 3 ? "Finalize Inflow" : "Process Network Step"}
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Section */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl group-hover:bg-cyan-600/20 transition-colors"></div>
          
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-mysterious mb-2">SCA Vault Balance</p>
              <h2 className="text-4xl font-display font-bold tracking-tight text-white glow-text">{balance}</h2>
            </div>
            <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-[10px] border border-cyan-500/20 font-bold tracking-widest">
              cUSDT
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleTogglePrivacy}
              className={`w-full ${isVaultPrivate ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50'} text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2 font-display uppercase tracking-mysterious text-sm`}
            >
              {isVaultPrivate ? <span>🔓 Reveal Vault</span> : <span>🔒 Encrypt Vault</span>}
            </button>

            <button 
              onClick={() => handleCopy("0x71C2607590022425000000000000000000004f21", setCopied)}
              className={`w-full py-4 rounded-2xl font-bold transition-all border text-sm uppercase tracking-mysterious flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 text-slate-300'}`}
            >
              {copied ? <span>✅ Copied Address</span> : <span>📋 Copy Wallet ID</span>}
            </button>
            
            {isVaultPrivate && fheExplain && (
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] text-cyan-500 uppercase tracking-mysterious mb-3">SCA & FHE Protocol</p>
                <p className="text-xs text-slate-400 leading-relaxed italic font-light">
                  {fheExplain}
                </p>
              </div>
            )}

            <button 
              onClick={startBridge}
              className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl transition-all border border-slate-700/50 text-sm uppercase tracking-mysterious flex items-center justify-center gap-2"
            >
              <span>⛓️</span> Multi-Chain Deposit
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious mb-4">Device Credentials</p>
          <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800 mb-2">
            <span className="text-xs text-slate-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
              Biometric Signer
            </span>
            <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded uppercase font-black">Active</span>
          </div>
          <button className="w-full py-2 text-[10px] text-indigo-400 hover:text-indigo-300 uppercase font-bold tracking-widest transition-colors">Manage Recovery Guardians</button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex border-b border-slate-800 p-2 gap-2">
            <button 
              onClick={() => setActiveTab('send')}
              className={`flex-1 py-4 rounded-2xl font-display font-bold text-xs uppercase tracking-mysterious transition-all ${activeTab === 'send' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
            >
              P2P Transfer
            </button>
            <button 
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-4 rounded-2xl font-display font-bold text-xs uppercase tracking-mysterious transition-all ${activeTab === 'withdraw' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
            >
              NGN Exit
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'send' ? (
              <form onSubmit={handleSend} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious">Recipient @Username</label>
                    <input 
                      type="text" 
                      value={txData.to}
                      onChange={e => setTxData({...txData, to: e.target.value})}
                      placeholder="@handle" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious">Amount (cUSDT)</label>
                    <input 
                      type="number" 
                      value={txData.amount}
                      onChange={e => setTxData({...txData, amount: e.target.value})}
                      placeholder="0.00" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious">Encrypted Memo</label>
                  <textarea 
                    value={txData.memo}
                    onChange={e => setTxData({...txData, memo: e.target.value})}
                    placeholder="Private context for the recipient..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all min-h-[100px] font-medium"
                  />
                </div>
                <button 
                  disabled={isProcessing}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-display font-bold py-5 rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-mysterious text-sm flex items-center justify-center gap-3"
                >
                  {isProcessing ? "Processing Finality..." : <span>Sign with Passkey</span>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious">Local Bank</label>
                    <select 
                      value={withdrawData.bank}
                      onChange={e => setWithdrawData({...withdrawData, bank: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select Destination</option>
                      {NIGERIAN_BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious">NUBAN Number</label>
                    <input 
                      type="text" 
                      maxLength={10}
                      value={withdrawData.accountNumber}
                      onChange={e => setWithdrawData({...withdrawData, accountNumber: e.target.value})}
                      placeholder="10-digit ID" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious">Withdrawal Volume</label>
                    <div className="relative">
                       <input 
                        type="number" 
                        value={withdrawData.amount}
                        onChange={e => setWithdrawData({...withdrawData, amount: e.target.value})}
                        placeholder="0.00" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium"
                        required
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-display font-bold text-emerald-500 tracking-mysterious">
                         ₦{(Number(withdrawData.amount || 0) * 1550).toLocaleString()} NGN
                      </div>
                    </div>
                </div>
                <button 
                  disabled={isProcessing}
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-display font-bold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-mysterious text-sm"
                >
                  {isProcessing ? "Confirming Settlement..." : "Initiate Bank Settlement"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-sm font-display font-bold text-slate-100 uppercase tracking-mysterious">Ledger Index</h2>
            {loading && <div className="w-4 h-4 border border-indigo-500 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-mysterious bg-slate-950/50">
                  <th className="px-8 py-5">Event</th>
                  <th className="px-8 py-5">Identity</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-indigo-500/5 transition-colors cursor-default group">
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${
                        tx.type === 'In' ? 'bg-green-500/10 text-green-400' : 
                        tx.type === 'Withdraw' ? 'bg-emerald-500/10 text-emerald-400' :
                        tx.type === 'Bridge' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-300 font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity">{tx.from || tx.to}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 italic text-xs font-light tracking-widest">{tx.amount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`text-[10px] font-bold uppercase tracking-mysterious ${tx.status === 'Completed' ? 'text-slate-600' : 'text-indigo-400 animate-pulse'}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
