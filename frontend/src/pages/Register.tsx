import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { Card, CardBody } from '../components/Card';
import { BrandWordmark } from '../components/Brand';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'USER' | 'SERVICE_PROVIDER'>('USER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', { name, email, password, role });
            navigate('/login');
        } catch (err: unknown) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((err as any).response?.data?.error || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-text-main transition-colors duration-0 p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <BrandWordmark textClassName="text-4xl sm:text-5xl" markClassName="h-12 w-12 sm:h-14 sm:w-14" />
                    <h1 className="mt-4 text-2xl font-semibold text-text-main text-center">Create your account</h1>
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
                                label="Full Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your Name"
                            />

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

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-text-main">Account Type</label>
                                <select
                                    className="px-3 py-2 bg-surface text-text-main border border-border-subtle rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'USER' | 'SERVICE_PROVIDER')}
                                >
                                    <option value="USER">Customer</option>
                                    <option value="SERVICE_PROVIDER">Service Provider</option>
                                </select>
                            </div>

                            <Button type="submit" fullWidth className="mt-2" disabled={loading}>
                                {loading ? 'Creating...' : 'Sign Up'}
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                <p className="text-center mt-6 text-text-muted text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-text-main font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
