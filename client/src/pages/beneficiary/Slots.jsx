import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, CheckCircle, XCircle, MapPin, Ticket } from 'lucide-react';

const BeneficiarySlots = () => {
  const [slots, setSlots] = useState([]);
  const [myBooking, setMyBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null); // id being booked

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        axios.get('/slots/available'),
        axios.get('/slots/my-booking').catch(() => ({ data: { data: null } }))
      ]);
      setSlots(sRes.data.data || []);
      setMyBooking(bRes.data.data);
    } catch {
      toast.error('Failed to load slots');
    } finally { setLoading(false); }
  };

  const handleBook = async (slotId) => {
    setBooking(slotId);
    try {
      const { data } = await axios.post(`/slots/${slotId}/book`);
      toast.success(data.message || 'Slot booked successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book slot');
    } finally { setBooking(null); }
  };

  const handleCancel = async (slotId) => {
    try {
      await axios.delete(`/slots/${slotId}/cancel`);
      toast.success('Booking cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Book a Slot</h1>
      <p className="text-gray-600 dark:text-gray-400">Reserve a time slot to collect your ration and avoid long queues.</p>

      {/* Current Booking Banner */}
      {myBooking && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Ticket className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">Your Upcoming Booking</p>
                <div className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(myBooking.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {myBooking.startTime} – {myBooking.endTime}
                  </div>
                  {myBooking.shop && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {myBooking.shop.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button onClick={() => handleCancel(myBooking._id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm">
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {slots.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {myBooking ? 'No other slots available' : 'No slots available'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Please contact admin to assign a ration shop to your account first
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map(slot => {
            const isFull = (slot.bookedCount || 0) >= slot.maxBeneficiaries;
            const isMyBooking = myBooking?._id === slot._id;
            const fillPct = Math.min(100, ((slot.bookedCount || 0) / slot.maxBeneficiaries) * 100);

            return (
              <div key={slot._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow p-5 border-2 transition-all ${isMyBooking ? 'border-green-500' : 'border-transparent hover:border-blue-200 dark:hover:border-blue-800'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 min-w-[56px]">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {new Date(slot.date).toLocaleDateString('en', { month: 'short' })}
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {new Date(slot.date).getDate()}
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400">
                      {new Date(slot.date).toLocaleDateString('en', { weekday: 'short' })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-medium">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {slot.startTime} – {slot.endTime}
                    </div>
                    {slot.shop && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <MapPin className="w-3 h-3" />{slot.shop.name}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Users className="w-3 h-3" />
                      {slot.bookedCount || 0}/{slot.maxBeneficiaries} booked
                    </div>
                  </div>
                </div>

                {/* Fill bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
                  <div
                    className={`h-1.5 rounded-full transition-all ${fillPct >= 100 ? 'bg-red-500' : fillPct >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>

                {isMyBooking ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-green-600 dark:text-green-400 font-medium text-sm bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-4 h-4" /> Booked
                  </div>
                ) : (
                  <button
                    onClick={() => handleBook(slot._id)}
                    disabled={isFull || !!myBooking || booking === slot._id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      isFull ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : myBooking ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {booking === slot._id ? 'Booking...' : isFull ? 'Slot Full' : myBooking ? 'Already Booked' : 'Book This Slot'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BeneficiarySlots;
