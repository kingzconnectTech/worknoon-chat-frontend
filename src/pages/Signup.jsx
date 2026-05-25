import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  
  const { signup, loading, error, clearError } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const success = await signup(formData);
    if (success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(useAuthStore.getState().error || 'Registration failed');
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
        )}>Create Account</h2>
        <p className={clsx(
          "text-sm",
          theme === "dark" ? "text-muted" : "text-muted-light"
        )}>Join Worknoon Chat to collaborate in real-time.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className={clsx(
            "text-sm font-medium ml-1",
            theme === "dark" ? "text-slate-300" : "text-slate-700"
          )}>Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={clsx("h-5 w-5", theme === "dark" ? "text-muted" : "text-muted-light")} />
            </div>
            <input
              id="name"
              type="text"
              name="name"
              required
              className={clsx(
                "block w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                theme === "dark" 
                  ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              )}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-email" className={clsx(
            "text-sm font-medium ml-1",
            theme === "dark" ? "text-slate-300" : "text-slate-700"
          )}>Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className={clsx("h-5 w-5", theme === "dark" ? "text-muted" : "text-muted-light")} />
            </div>
            <input
              id="signup-email"
              type="email"
              name="email"
              required
              className={clsx(
                "block w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                theme === "dark" 
                  ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              )}
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="signup-password" className={clsx(
            "text-sm font-medium ml-1",
            theme === "dark" ? "text-slate-300" : "text-slate-700"
          )}>Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className={clsx("h-5 w-5", theme === "dark" ? "text-muted" : "text-muted-light")} />
            </div>
            <input
              id="signup-password"
              type="password"
              name="password"
              required
              className={clsx(
                "block w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all",
                theme === "dark" 
                  ? "bg-white/5 border-white/10 text-white placeholder-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
              )}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-accent to-purple-500 hover:from-accent hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-70 mt-4"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <div className={clsx(
        "mt-8 text-center text-sm",
        theme === "dark" ? "text-muted" : "text-muted-light"
      )}>
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:text-accent/80 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
