import React from 'react';
import { LayoutDashboard, ReceiptText, BrainCircuit, UserCog, LogOut, Menu, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useFinance();
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', name: 'Transactions', icon: ReceiptText },
    { id: 'insights', name: 'Insights', icon: BrainCircuit },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-md text-foreground"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">$</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Finova</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${activeTab === item.id 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto space-y-6">
            {/* User Profile */}
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-border"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded inline-block">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-lg w-full transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
