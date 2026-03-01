import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar } from 'lucide-react';
import Button from './Button';

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
        <div className="min-h-screen flex flex-col bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to={rootPath} className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        BookIt
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-gray-200"></div>

                        <Button variant="secondary" onClick={handleLogout} className="!py-1.5 !px-3 text-sm">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-5xl mx-auto p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
