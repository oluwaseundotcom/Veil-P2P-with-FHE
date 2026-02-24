
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUsername(session.user.email?.split('@')[0] || "shadow_operator");
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUsername(session.user.email?.split('@')[0] || "shadow_operator");
      }
    });

    return () => subscription.unsubscribe();
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
      onLogout={handleLogout}
    >
      {view === 'dashboard' ? <Dashboard /> : <ArchitectureDoc />}
    </Layout>
  );
};

export default App;
