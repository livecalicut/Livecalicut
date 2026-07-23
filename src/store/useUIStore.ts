import { create } from 'zustand';

interface UIState {
  theme: 'dark' | 'light';
  isMobileMenuOpen: boolean;
  selectedLocation: string;
  searchQuery: string;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleMobileMenu: () => void;
  setSelectedLocation: (location: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  isMobileMenuOpen: false,
  selectedLocation: 'All Locations',
  searchQuery: '',

  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    return { theme: nextTheme };
  }),

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
