import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            isDark: true,
            toggleTheme: () => set((state) => {
                const newDark = !state.isDark;
                if (newDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { isDark: newDark };
            }),
            init: () => {
                const isDark = useThemeStore.getState().isDark;
                if (isDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        }),
        {
            name: 'theme-storage',
        }
    )
);

export default useThemeStore;
