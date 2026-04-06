import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, User, ArrowRight, Lock } from 'lucide-react';

const Login = () => {
  const { login } = useFinance();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden p-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40"
          >
            <Wallet className="text-primary-foreground" size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Finova</h1>
          <p className="text-muted-foreground">Premium Financial Intelligence Dashboard</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 lg:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-zinc-600"
                  placeholder="admin or viewer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-zinc-400">Password</label>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Hint: password</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
              >
                Log In
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Admin Access</p>
              <p className="text-xs text-zinc-400 font-mono">admin / password</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">User Access</p>
              <p className="text-xs text-zinc-400 font-mono">viewer / password</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-zinc-500 text-sm h-5">
          {error ? (
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-500 font-medium"
            >
              {error}
            </motion.span>
          ) : "Protected by enterprise-grade security encryption."}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
