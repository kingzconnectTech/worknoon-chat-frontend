import { Outlet } from 'react-router-dom';
import useThemeStore from '../store/useThemeStore';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';

const AuthLayout = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className={clsx(
      "min-h-screen flex",
      theme === "dark" ? "bg-background" : "bg-background-light"
    )}>
      <div className={clsx(
        "hidden lg:flex lg:w-1/2 relative overflow-hidden",
        theme === "dark" ? "bg-card" : "bg-card-light"
      )}>
        <div className={clsx(
          "absolute inset-0 bg-gradient-to-br from-accent/20 z-0",
          theme === "dark" ? "to-background" : "to-background-light"
        )} />
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12 text-center">
          <div className="mb-8 w-32 h-32 rounded-3xl bg-accent/20 flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
            <span className="text-4xl font-bold text-white tracking-tighter">WN</span>
          </div>
          <h1 className={clsx(
            "text-5xl font-bold mb-6",
            theme === "dark" ? "text-white" : "text-text-light"
          )}>Worknoon Chat</h1>
          <p className={clsx(
            "text-xl max-w-md",
            theme === "dark" ? "text-muted" : "text-muted-light"
          )}>
            The premium real-time communication platform for your eCommerce business.
          </p>
        </div>
        
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className={clsx(
        "flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative",
        theme === "dark" ? "bg-background" : "bg-background-light"
      )}>
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
              theme === "dark"
                ? "text-muted hover:bg-white/5 hover:text-white"
                : "text-muted-light hover:bg-slate-100 hover:text-slate-900"
            )}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
