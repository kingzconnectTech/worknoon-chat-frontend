import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, User, LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, to }) => {
  const { theme } = useThemeStore();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex flex-col items-center justify-center w-14 h-14 mb-4 rounded-2xl transition-all duration-300',
          isActive
            ? 'bg-accent text-white shadow-lg shadow-accent/30'
            : theme === 'dark' 
              ? 'text-muted hover:bg-white/5 hover:text-white'
              : 'text-muted-light hover:bg-slate-100 hover:text-slate-900'
        )
      }
      title={label}
      aria-label={label}
    >
      {({ isActive }) => (
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      )}
    </NavLink>
  );
};

const BottomNavItem = ({ icon: Icon, label, to }) => {
  const { theme } = useThemeStore();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex flex-col items-center justify-center gap-1 transition-all duration-200',
          isActive
            ? 'text-accent'
            : theme === 'dark' ? 'text-muted' : 'text-muted-light'
        )
      }
    >
      {({ isActive }) => (
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      )}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={clsx(
      "flex flex-col lg:flex-row h-screen overflow-hidden font-sans",
      theme === "dark" ? "bg-background text-text" : "bg-white text-slate-900"
    )}>
      {/* Global Sidebar Navigation (hidden on mobile) */}
      <nav className={clsx(
        "hidden lg:flex w-20 lg:w-24 border-r flex flex-col items-center py-6 z-20",
        theme === "dark" 
          ? "border-white/5 glass" 
          : "border-slate-100 glass-light"
      )}>
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-accent/20">
            W
          </div>
        </div>
        
        <div className="flex-1 w-full flex flex-col items-center mt-4">
          <SidebarItem icon={MessageSquare} label="Inbox" to="/" />
          <SidebarItem icon={User} label="Profile" to="/profile" />
          {user?.role === 'admin' && (
            <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          )}
        </div>
        
        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            onClick={toggleTheme}
            className={clsx(
              "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300",
              theme === "dark" 
                ? "text-muted hover:bg-white/5 hover:text-white"
                : "text-muted-light hover:bg-slate-100 hover:text-slate-900"
            )}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <div className={clsx(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden",
            theme === "dark" 
              ? "bg-slate-700 border-white/10"
              : "bg-slate-200 border-slate-300"
          )}>
            {user?.avatar ? (
              <img src={user.avatar} alt={`${user.name}'s avatar`} className="w-full h-full object-cover" />
            ) : (
              <span className={clsx(
                "text-sm font-medium uppercase",
                theme === "dark" ? "text-white" : "text-slate-700"
              )}>{user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className={clsx(
              "w-12 h-12 flex items-center justify-center rounded-xl transition-colors",
              theme === "dark"
                ? "text-muted hover:bg-red-500/10 hover:text-red-500"
                : "text-muted-light hover:bg-red-50 border-red-200 hover:text-red-500"
            )}
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Bottom Navigation (visible on mobile) */}
      <nav className={clsx(
        "lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex items-center justify-around p-3 pb-safe",
        theme === "dark" 
          ? "border-white/5 glass" 
          : "border-slate-100 glass-light"
      )}>
        <BottomNavItem icon={MessageSquare} label="Inbox" to="/" />
        <BottomNavItem icon={User} label="Profile" to="/profile" />
        {user?.role === 'admin' && (
          <BottomNavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        )}
        <button
          onClick={toggleTheme}
          className={clsx(
            "flex flex-col items-center justify-center gap-1",
            theme === "dark" ? "text-muted" : "text-muted-light"
          )}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          <span className="text-xs font-medium">Theme</span>
        </button>
      </nav>
    </div>
  );
};

export default MainLayout;
