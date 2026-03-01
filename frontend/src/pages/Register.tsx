import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { Card, CardBody } from '../components/Card';
import { Calendar } from 'lucide-react';

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
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register');
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
                    <h1 className="text-2xl font-semibold text-slate-900">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join AppointmentLelo.io to get started</p>
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
                                <label className="text-sm font-medium text-slate-700">Account Type</label>
                                <select
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as any)}
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

                <p className="text-center mt-6 text-slate-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-slate-900 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
