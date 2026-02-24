
import React, { useState, useEffect } from 'react';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'architecture'>('dashboard');
  const [session, setSession] = useState<any>(null);
  const [username, setUsername] = useState("shadow_operator");
  const [walletAddress, setWalletAddress] = useState<string>("0x0000...0000");
  const [loading, setLoading] = useState(true);

  const deriveWallet = (userId: string) => {
    const hash = userId.replace(/-/g, '');
    return `0x${hash.substring(0, 36).padEnd(40, 'f')}`;
  };

  useEffect(() => {
    // Safety timeout for loading state
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUsername(session.user.email?.split('@')[0] || "shadow_operator");
        setWalletAddress(deriveWallet(session.user.id));
      }
      setLoading(false);
      clearTimeout(timeout);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUsername(session.user.email?.split('@')[0] || "shadow_operator");
        setWalletAddress(deriveWallet(session.user.id));
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Login onLogin={() => {
      // Session will be updated by onAuthStateChange
    }} />;
  }

  return (
    <Layout 
      currentView={view} 
      onViewChange={setView} 
      username={username}
      walletAddress={walletAddress}
      onLogout={handleLogout}
    >
      {view === 'dashboard' ? <Dashboard walletAddress={walletAddress} /> : <ArchitectureDoc />}
    </Layout>
  );
};

export default App;
