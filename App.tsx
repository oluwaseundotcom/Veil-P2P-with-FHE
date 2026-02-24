
import React, { useState } from 'react';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'architecture'>('dashboard');
  const [username] = useState("shadow_operator");

  return (
    <Layout currentView={view} onViewChange={setView} username={username}>
      {view === 'dashboard' ? <Dashboard /> : <ArchitectureDoc />}
    </Layout>
  );
};

export default App;
