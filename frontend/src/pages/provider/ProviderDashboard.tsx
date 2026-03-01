import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Card, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Clock, Plus, Settings2 } from 'lucide-react';

const SERVICE_TYPES = ["MEDICAL", "HOUSE_HELP", "BEAUTY", "FITNESS", "EDUCATION", "OTHER"];

interface ProviderService {
    serviceId: string;
    serviceName: string;
}

const ProviderDashboard = () => {
    const [services, setServices] = useState<ProviderService[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [type, setType] = useState('MEDICAL');
    const [duration, setDuration] = useState('30');

    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMyServices = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data } = await api.get(`/providers/me/schedule?date=${today}`);
            setServices(data.services || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyServices();
    }, []);

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        setSubmitSuccess('');
        setIsSubmitting(true);

        try {
            await api.post('/services', {
                name,
                type,
                durationMinutes: parseInt(duration, 10)
            });
            setSubmitSuccess('Service created successfully!');
            setName('');
            setDuration('30');
            fetchMyServices(); // Refresh list
        } catch (err: any) {
            setSubmitError(err.response?.data?.error || 'Failed to create service.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Service Section */}
            <div className="lg:col-span-1 border-r-0 lg:border-r border-gray-200 lg:pr-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Create Service</h1>
                    <p className="text-slate-500 mt-1">Add a new service to your catalog</p>
                </div>

                <Card>
                    <CardBody>
                        <form onSubmit={handleCreateService} className="flex flex-col gap-4">
                            {submitError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{submitError}</div>}
                            {submitSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">{submitSuccess}</div>}

                            <Input
                                label="Service Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. general checkup"
                            />

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-slate-700">Type</label>
                                <select
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    {SERVICE_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-sm font-medium text-slate-700">Duration (Minutes)</label>
                                <select
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <option value="30">30 min</option>
                                    <option value="60">60 min</option>
                                    <option value="90">90 min</option>
                                    <option value="120">120 min</option>
                                </select>
                            </div>

                            <Button type="submit" fullWidth className="mt-2" disabled={isSubmitting}>
                                <Plus className="w-4 h-4" />
                                {isSubmitting ? 'Creating...' : 'Create Service'}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>

            {/* Services List Section */}
            <div className="lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">My Services</h2>
                        <p className="text-slate-500 mt-1">Manage your services and availability</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <Settings2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No Services Found</h3>
                        <p className="text-slate-500 mt-1 text-sm">Create a service to start accepting bookings.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {services.map(service => (
                            <Card key={service.serviceId} className="hover:shadow-sm transition-shadow">
                                <CardBody>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">{service.serviceName}</h3>
                                    <Link
                                        to={`/provider/services/${service.serviceId}/availability`}
                                        className="w-full text-center py-2 px-4 bg-white border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Clock className="w-4 h-4" />
                                        Set Availability
                                    </Link>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;
