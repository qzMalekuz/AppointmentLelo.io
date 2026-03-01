import { useState, useEffect } from 'react';
import api from '../api/axios';

import { Calendar, Clock } from 'lucide-react';

interface Appointment {
    serviceName: string;
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
}

const MyAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await api.get('/appointments/me');
                setAppointments(data);
            } catch (err) {
                setError('Failed to load appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
                <p className="text-slate-500 mt-1">Manage all your booked services</p>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>
            ) : loading ? (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center p-16 bg-white rounded-xl border border-gray-200 border-dashed">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Appointments Yet</h3>
                    <p className="text-slate-500 mt-1">Go to the dashboard to book a service.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50/50 text-slate-500 font-medium border-b border-gray-100 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((appt, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{appt.serviceName}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{appt.type}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {appt.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                {appt.startTime} - {appt.endTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {appt.status === 'BOOKED' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    CONFIRMED
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    CANCELLED
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
