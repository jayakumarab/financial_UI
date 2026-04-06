import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import Login from './components/Login';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview key="overview" />;
      case 'transactions':
        return <Transactions key="transactions" />;
      case 'insights':
        return <Insights key="insights" />;
      default:
        return <Overview key="overview" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 antialiased">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useFinance();
  
  return isAuthenticated ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
