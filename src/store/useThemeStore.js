import { create } from 'zustand';

const useThemeStore = create((set) => {
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  return {
    theme: initialTheme,
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
      });
    }
  };
});

export default useThemeStore;
