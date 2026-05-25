import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import useThemeStore from './store/useThemeStore.js'

function ThemeInitializer() {
  const { theme } = useThemeStore();
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeInitializer />
    <App />
  </React.StrictMode>,
)
