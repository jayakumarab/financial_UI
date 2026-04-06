import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';

const Overview = () => {
  const { totals, transactions, allTransactions } = useFinance();

  // Calculate Cumulative Balance Trend
  let rollingBalance = 0;
  const chartData = [...allTransactions]
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .map(t => {
      if (t.type === 'income') rollingBalance += t.amount;
      else rollingBalance -= t.amount;
      return {
        name: t.date,
        balance: rollingBalance,
        amount: t.amount,
      };
    });

  const pieData = [
    { name: 'Income', value: totals.income, color: '#10b981' },
    { name: 'Expenses', value: totals.expenses, color: '#ef4444' },
  ];

  const cards = [
    { title: 'Total Balance', value: totals.balance, icon: Wallet, color: 'text-primary' },
    { title: 'Total Income', value: totals.income, icon: ArrowUpCircle, color: 'text-emerald-500' },
    { title: 'Total Expenses', value: totals.expenses, icon: ArrowDownCircle, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
        <p className="text-muted-foreground">Welcome back, here's your spending summary.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all pointer-events-auto"
          >
            <div className="relative z-10">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1">${card.value.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform ${card.color}`}>
              <card.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Balance Trend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-4 p-6 rounded-2xl bg-card border border-border shadow-sm pointer-events-none"
        >
          <div className="flex items-center justify-between mb-6 pointer-events-auto">
            <div>
              <h3 className="text-lg font-semibold">Balance Trend</h3>
              <p className="text-sm text-muted-foreground">Daily transaction volume</p>
            </div>
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div className="h-[300px] w-full pointer-events-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 p-6 rounded-2xl bg-card border border-border shadow-sm pointer-events-none"
        >
          <div className="mb-6 pointer-events-auto">
            <h3 className="text-lg font-semibold">Spending Structure</h3>
            <p className="text-sm text-muted-foreground">Income vs Expenses ratio</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center pointer-events-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fafafa' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
