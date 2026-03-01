import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Card, CardBody } from '../components/Card';
import { Clock, User as UserIcon } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    type: string;
    durationMinutes: number;
    providerName: string;
}

const SERVICE_TYPES = ["ALL", "MEDICAL", "HOUSE_HELP", "BEAUTY", "FITNESS", "EDUCATION", "OTHER"];

const UserDashboard = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [filterType, setFilterType] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchServices = async (type: string) => {
        setLoading(true);
        try {
            const url = type === 'ALL' ? '/services' : `/services?type=${type}`;
            const { data } = await api.get(url);
            setServices(data);
        } catch (err) {
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices(filterType);
    }, [filterType]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Available Services</h1>
                    <p className="text-slate-500 text-sm mt-1">Book your next appointment</p>
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                >
                    {SERVICE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>
            ) : loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl border border-gray-200 border-dashed">
                    <p className="text-slate-500">No services found for this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <Card key={service.id} className="hover:shadow-md transition-shadow">
                            <CardBody className="flex flex-col h-full">
                                <div className="mb-4">
                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md mb-3">
                                        {service.type}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{service.name}</h3>
                                </div>

                                <div className="space-y-2 mt-auto text-sm text-slate-600 mb-6">
                                    <div className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                        <span>{service.providerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>{service.durationMinutes} minutes</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/services/${service.id}`}
                                    className="w-full text-center py-2 px-4 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                >
                                    View Slots
                                </Link>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
