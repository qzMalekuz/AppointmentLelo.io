import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeToken } from '../utils/jwt';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { Card, CardBody } from '../components/Card';
import { BrandWordmark } from '../components/Brand';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            const decoded = decodeToken(data.token);

            if (decoded && decoded.role) {
                login(data.token, decoded.role);
                if (decoded.role === 'USER') {
                    navigate('/dashboard');
                } else {
                    navigate('/provider/dashboard');
                }
            } else {
                setError('Invalid token received.');
            }
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((err as any).response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-text-main transition-colors duration-0 p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <BrandWordmark textClassName="text-4xl sm:text-5xl" markClassName="h-12 w-12 sm:h-14 sm:w-14" />
                    <h1 className="mt-4 text-2xl font-semibold text-text-main text-center">Welcome Back</h1>
                    <p className="text-text-muted mt-2 text-center text-sm max-w-sm">Your one stop to book and track all your appointments</p>
                </div>

                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-100 dark:border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />

                            <Button type="submit" fullWidth className="mt-2" disabled={loading}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <p className="text-center mt-6 text-text-muted text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-text-main font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
