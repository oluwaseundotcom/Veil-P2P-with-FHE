
import React, { useState } from 'react';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { Login } from './components/Login';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'architecture'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("shadow_operator");

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={(name) => {
      setUsername(name);
      setIsAuthenticated(true);
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
