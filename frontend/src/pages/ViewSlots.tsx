import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Card, CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Slot {
    slotId: string;
    startTime: string;
    endTime: string;
}

const ViewSlots = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [bookingSlot, setBookingSlot] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchSlots = async (selectedDate: string) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get(`/services/${id}/slots?date=${selectedDate}`);
            setSlots(data.slots || []);
        } catch (err) {
            setError('Failed to fetch available slots.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots(date);
    }, [date, id]);

    const handleBook = async (slotId: string) => {
        setBookingSlot(slotId);
        setError('');
        setSuccess('');

        try {
            await api.post('/appointments', { slotId });
            setSuccess('Appointment booked successfully!');
            fetchSlots(date); // Refresh slots
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to book slot.');
        } finally {
            setBookingSlot(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
                    <p className="text-slate-500 mt-1">Select a date and time slot</p>
                </div>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                    Back
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center justify-between">
                    {success}
                    <Button variant="secondary" onClick={() => navigate('/appointments')} className="!py-1.5 !px-3 text-sm border-emerald-200">
                        View My Appointments
                    </Button>
                </div>
            )}

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-6 bg-white border-b-gray-100">
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                        Select Date
                    </div>
                    <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm font-medium"
                    />
                </CardHeader>
                <CardBody className="p-6 bg-gray-50/30">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
                        </div>
                    ) : slots.length === 0 ? (
                        <div className="text-center py-12">
                            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No Slots Available</h3>
                            <p className="text-slate-500 mt-1 text-sm">Try selecting a different date.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {slots.map(slot => (
                                <button
                                    key={slot.slotId}
                                    disabled={bookingSlot === slot.slotId}
                                    onClick={() => handleBook(slot.slotId)}
                                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-slate-900 hover:shadow-sm transition-all focus:ring-2 focus:ring-slate-900/10 outline-none group text-left relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="text-slate-900 font-semibold">{slot.startTime}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">to {slot.endTime}</div>

                                    {bookingSlot === slot.slotId && (
                                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default ViewSlots;
