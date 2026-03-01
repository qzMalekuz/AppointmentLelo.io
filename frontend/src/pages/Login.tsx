import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeToken } from '../utils/jwt';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { Card, CardBody } from '../components/Card';
import { Calendar } from 'lucide-react';

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
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 mt-2">Sign in to your account</p>
                </div>

                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
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

                <p className="text-center mt-6 text-slate-600 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-slate-900 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
