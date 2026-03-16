import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Button from './Button';
import { BrandWordmark } from './Brand';
import { motion } from 'framer-motion';

const Layout = () => {
    const { logout, role } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = role === 'USER'
        ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'My Appointments', path: '/appointments' },
        ]
        : [
            { name: 'Dashboard', path: '/provider/dashboard' },
            { name: 'Daily Schedule', path: '/provider/schedule' },
        ];

    const rootPath = role === 'USER' ? '/dashboard' : '/provider/dashboard';

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 transition-all duration-300 ease-out">
            <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10 transition-colors duration-300">
                <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
                    <Link to={rootPath} className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                        <BrandWordmark textClassName="hidden sm:inline text-lg" markClassName="h-8 w-8 rounded-lg" />
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                        <div className="hidden md:flex gap-2 lg:gap-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `text-sm px-3 py-1.5 rounded-md transition-all duration-300 ease-out ${
                                            isActive
                                                ? 'font-semibold bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                                                : 'font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800/70'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700" />

                        <ThemeToggle />

                        <Button variant="danger" onClick={handleLogout} className="flex items-center gap-2 px-2.5 sm:px-4 py-2 text-sm">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>

            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex-1 w-full max-w-5xl mx-auto p-6 transition-all duration-300 ease-out"
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default Layout;
