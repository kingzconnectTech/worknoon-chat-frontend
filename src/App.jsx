import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';
import useOfflineStore from './store/useOfflineStore';
import socketService from './socket/socketService';
import clsx from 'clsx';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const { isOnline } = useOfflineStore();

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }
    
    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      {!isOnline && (
        <div className={clsx(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 py-2 px-4 shadow-lg",
          theme === "dark" ? "bg-amber-500/20 text-amber-300 border-b border-amber-500/30" : "bg-amber-100 text-amber-800 border-b border-amber-200"
        )} role="alert">
          <WifiOff size={18} />
          <span className="text-sm font-medium">You are currently offline. Some features may not work properly.</span>
        </div>
      )}
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: clsx(
            '!border !shadow-xl',
            theme === "dark" ? '!bg-card !text-text !border-white/10' : '!bg-card-light !text-text-light !border-slate-200'
          ),
          style: {
            background: theme === "dark" ? '#1E293B' : '#FFFFFF',
            color: theme === "dark" ? '#F8FAFC' : '#0F172A',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
