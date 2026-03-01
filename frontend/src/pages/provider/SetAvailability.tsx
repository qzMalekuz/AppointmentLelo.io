import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Card, CardBody } from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Clock } from 'lucide-react';

const DAYS_OF_WEEK = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
];

const SetAvailability = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [dayOfWeek, setDayOfWeek] = useState('1'); // Default to Monday
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post(`/services/${id}/availability`, {
                dayOfWeek: parseInt(dayOfWeek, 10),
                startTime,
                endTime
            });
            setSuccess('Availability added successfully!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add availability.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Set Availability</h1>
                    <p className="text-slate-500 mt-1">Define your working hours for this service</p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/provider/dashboard')}>
                    Back
                </Button>
            </div>

            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
                        {success && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">{success}</div>}

                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-slate-700">Day of the Week</label>
                            <select
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                            >
                                {DAYS_OF_WEEK.map(day => (
                                    <option key={day.value} value={day.value}>{day.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Start Time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                            <Input
                                label="End Time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="text-sm text-blue-800">
                                    <span className="font-semibold block mb-1">Time Format Note:</span>
                                    Please use 24-hour HH:MM format (e.g., 09:00 for 9 AM, 14:30 for 2:30 PM).
                                    Ensure start time is before end time.
                                </div>
                            </div>
                        </div>

                        <Button type="submit" fullWidth className="mt-2" disabled={loading}>
                            {loading ? 'Saving...' : 'Add Availability'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default SetAvailability;
