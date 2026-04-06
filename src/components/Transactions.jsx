import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Trash2, ArrowUpRight, ArrowDownLeft, Calendar,
  CreditCard, Tag, DollarSign, X, ArrowUpDown
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const Transactions = () => {
  const { transactions, role, setFilter, search, setSearch, sortBy, setSortBy, addTransaction, deleteTransaction } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAdd = (e) => {
    e.preventDefault();
    addTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    });
    setIsModalOpen(false);
    setNewTransaction({
      description: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h2>
          <p className="text-muted-foreground">Manage and track your financial activities.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-medium"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search description or category..." 
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground" size={18} />
            <select 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <ArrowUpDown className="text-muted-foreground" size={18} />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High-Low</option>
              <option value="amount-asc">Amount: Low-High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">Transaction</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">Type</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                {role === 'admin' && <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode='popLayout'>
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <motion.tr 
                      key={t.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {t.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                          </div>
                          <span className="font-medium text-sm">{t.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {t.date}
                      </td>
                      <td className={`px-6 py-4 font-bold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount}
                      </td>
                      {role === 'admin' && (
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <DollarSign size={48} className="opacity-10 mb-2" />
                        <p className="font-medium">No transactions found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">New Transaction</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Shopping, Rent"
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      required 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      required 
                      type="date" 
                      className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Food"
                      className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <select 
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
              >
                Create Transaction
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
