import React, { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (e: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    const [overlay, setOverlay] = useState<{ x: number; y: number; newTheme: Theme } | null>(null);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (e: React.MouseEvent) => {
        if (animating) return;

        const x = e.clientX;
        const y = e.clientY;
        const newTheme = theme === 'light' ? 'dark' : 'light';

        setAnimating(true);
        setOverlay({ x, y, newTheme });
    };

    const handleAnimationComplete = () => {
        if (overlay) {
            setTheme(overlay.newTheme);
            setOverlay(null);
            setAnimating(false);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
            <AnimatePresence>
                {overlay && (
                    <motion.div
                        key="theme-overlay"
                        initial={{ clipPath: `circle(0px at ${overlay.x}px ${overlay.y}px)` }}
                        animate={{ clipPath: `circle(150% at ${overlay.x}px ${overlay.y}px)` }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        onAnimationComplete={handleAnimationComplete}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 99999,
                            pointerEvents: 'none',
                            backgroundColor: overlay.newTheme === 'dark' ? '#121212' : '#F5F5F5',
                        }}
                    />
                )}
            </AnimatePresence>
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
