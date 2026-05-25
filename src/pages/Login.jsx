import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(useAuthStore.getState().error || 'Login failed');
    }
  };

  return (
    <div className={clsx(
      "p-8 rounded-3xl w-full",
      theme === "dark" ? "glass-card" : "glass-card-light"
    )}>
      <div className="mb-8">
        <h2 className={clsx(
          "text-3xl font-bold mb-2",
          theme === "dark" ? "text-white" : "text-text-light"
        )}>Welcome Back</h2>
        <p className={clsx(
          "text-sm",
          theme === "dark" ? "text-muted" : "text-muted-light"
        )}>Enter your credentials to access your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className={clsx(
            "text-sm font-medium ml-1",
            theme === "dark" ? "text-slate-300" : "text-slate-700"
          )}>Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={clsx("h-5 w-5", theme === "dark" ? "text-muted" : "text-muted-light")} />
            </div>
            <input
              id="email"
              type="email"
              required
              className={clsx(
                "block w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                theme === "dark" 
                  ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              )}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label htmlFor="password" className={clsx(
              "text-sm font-medium",
              theme === "dark" ? "text-slate-300" : "text-slate-700"
            )}>Password</label>
            <a href="#" className="text-sm text-accent hover:text-accent/80 transition-colors">Forgot password?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={clsx("h-5 w-5", theme === "dark" ? "text-muted" : "text-muted-light")} />
            </div>
            <input
              id="password"
              type="password"
              required
              className={clsx(
                "block w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                theme === "dark" 
                  ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              )}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-accent to-purple-500 hover:from-accent hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className={clsx(
        "mt-8 text-center text-sm",
        theme === "dark" ? "text-muted" : "text-muted-light"
      )}>
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-accent hover:text-accent/80 transition-colors">
          Sign up now
        </Link>
      </div>
    </div>
  );
};

export default Login;
