import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const MOCK_TRANSACTIONS = [
  // April 2026
  { id: 1, date: '2026-04-01', amount: 2500, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: 2, date: '2026-04-02', amount: 120, category: 'Food', type: 'expense', description: 'Grocery shopping' },
  { id: 3, date: '2026-04-03', amount: 50, category: 'Transport', type: 'expense', description: 'Uber ride' },
  { id: 4, date: '2026-04-04', amount: 450, category: 'Entertainment', type: 'expense', description: 'Concert tickets' },
  { id: 5, date: '2026-04-05', amount: 800, category: 'Rent', type: 'expense', description: 'Monthly rent' },
  { id: 6, date: '2026-04-06', amount: 1500, category: 'Freelance', type: 'income', description: 'Web design project' },
  { id: 7, date: '2026-04-06', amount: 65, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
  // March 2026
  { id: 101, date: '2026-03-01', amount: 2500, category: 'Salary', type: 'income', description: 'March Salary' },
  { id: 102, date: '2026-03-10', amount: 150, category: 'Food', type: 'expense', description: 'Dinner out' },
  { id: 103, date: '2026-03-15', amount: 300, category: 'Shopping', type: 'expense', description: 'New shoes' },
  { id: 104, date: '2026-03-20', amount: 800, category: 'Rent', type: 'expense', description: 'March rent' },
  { id: 105, date: '2026-03-25', amount: 1200, category: 'Freelance', type: 'income', description: 'Consulting' },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('finance_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_user', JSON.stringify(user));
  }, [user]);

  const login = (username, password, explicitRole) => {
    let role = explicitRole;
    
    if (!explicitRole) {
      if (username === 'admin' && password === 'password') {
        role = 'admin';
      } else if (username === 'viewer' && password === 'password') {
        role = 'viewer';
      } else {
        return false;
      }
    }

    const mockUser = {
      name: role === 'admin' ? 'Admin User' : 'Standard User',
      role: role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
    };
    setUser(mockUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addTransaction = (transaction) => {
    if (user?.role !== 'admin') return;
    const newTransaction = {
      ...transaction,
      id: Date.now(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    if (user?.role !== 'admin') return;
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions
    .filter(t => {
      const matchesFilter = filter === 'all' || t.type === filter;
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || 
                            t.category.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const getMonthlyStats = (monthStr) => { // format: '2026-04'
    return transactions
      .filter(t => t.date.startsWith(monthStr))
      .reduce((acc, current) => {
        if (current.type === 'income') acc.income += current.amount;
        else acc.expenses += current.amount;
        acc.balance = acc.income - acc.expenses;
        return acc;
      }, { income: 0, expenses: 0, balance: 0 });
  };

  const currentTotals = getMonthlyStats('2026-04');
  const pastTotals = getMonthlyStats('2026-03');

  return (
    <FinanceContext.Provider value={{
      transactions: filteredTransactions,
      allTransactions: transactions,
      totals: currentTotals,
      pastTotals,
      user,
      isAuthenticated: !!user,
      role: user?.role || 'viewer',
      login,
      logout,
      filter,
      setFilter,
      search,
      setSearch,
      sortBy,
      setSortBy,
      addTransaction,
      deleteTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
