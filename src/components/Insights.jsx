import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, 
  ArrowRight, PieChart, Calendar, Calculator
} from 'lucide-react';
import { motion } from 'framer-motion';

const Insights = () => {
  const { allTransactions, totals, pastTotals } = useFinance();

  // Simple Logic for Insights
  const highestSpendingCategory = allTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, current) => {
      acc[current.category] = (acc[current.category] || 0) + current.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(highestSpendingCategory)
    .sort(([, a], [, b]) => b - a)[0] || ['None', 0];

  const savingsRate = totals.income > 0 
    ? ((totals.income - totals.expenses) / totals.income * 100).toFixed(1) 
    : 0;

  const incomeGrowth = pastTotals.income > 0 
    ? (((totals.income - pastTotals.income) / pastTotals.income) * 100).toFixed(1) 
    : 'New';

  const expenseGrowth = pastTotals.expenses > 0 
    ? (((totals.expenses - pastTotals.expenses) / pastTotals.expenses) * 100).toFixed(1) 
    : 'New';

  const insights = [
    {
      title: 'Monthly Income Change',
      value: `${incomeGrowth > 0 ? '+' : ''}${incomeGrowth}%`,
      detail: 'vs last month',
      icon: TrendingUp,
      color: parseFloat(incomeGrowth) >= 0 ? 'text-emerald-500' : 'text-rose-500',
      description: parseFloat(incomeGrowth) >= 0 
        ? "Your income is increasing! Great job on maintaining positive cash flow." 
        : "Your income decreased slightly this month. Check your freelance or side-hustle activity."
    },
    {
      title: 'Top Spending Category',
      value: topCategory[0],
      detail: `$${topCategory[1].toLocaleString()} total this month`,
      icon: PieChart,
      color: 'text-rose-500',
      description: `You've spent the most on ${topCategory[0]}. Consider reviewing these expenses to save more.`
    },
    {
      title: 'Expense Growth',
      value: `${expenseGrowth > 0 ? '+' : ''}${expenseGrowth}%`,
      detail: 'Spending delta',
      icon: TrendingDown,
      color: parseFloat(expenseGrowth) <= 0 ? 'text-emerald-500' : 'text-rose-500',
      description: parseFloat(expenseGrowth) <= 0 
        ? "Excellent! You've reduced your spending compared to last month." 
        : "Your spending has increased. Review your recent transactions for non-essential costs."
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Financial Insights</h2>
        <p className="text-muted-foreground">Automated observations from your financial activity.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border flex flex-col shadow-sm group hover:border-primary/50 transition-all pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform ${insight.color}`}>
                <insight.icon size={20} />
              </div>
              <CheckCircle2 size={16} className="text-muted-foreground/30" />
            </div>
            
            <h3 className="text-sm font-medium text-muted-foreground">{insight.title}</h3>
            <div className="flex items-baseline gap-2 mt-1 mb-2">
              <span className="text-2xl font-bold">{insight.value}</span>
              <span className="text-xs text-muted-foreground font-medium">{insight.detail}</span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2 flex-1">
              {insight.description}
            </p>

            <button className="flex items-center gap-2 text-xs font-bold text-primary mt-6 hover:gap-3 transition-all">
              VIEW DETAILS
              <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
        <Calculator className="absolute -right-8 -bottom-8 w-48 h-48 text-primary/5 rotate-12 transition-transform group-hover:scale-110 duration-700" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-xl font-bold mb-2">Smart Recommendation</h3>
          <p className="text-muted-foreground mb-6">
            Based on your current spending of <span className="text-foreground font-semibold">${totals.expenses.toLocaleString()}</span>, 
            you can potentially save an additional <span className="text-emerald-500 font-semibold">$350</span> this month by optimizing 
            your {topCategory[0]} category.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-all">
              Apply Strategy
            </button>
            <button className="px-6 py-2 bg-transparent text-foreground border border-border font-bold rounded-lg hover:bg-muted transition-all">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
