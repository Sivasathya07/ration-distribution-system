import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Star, Send, MessageSquare, Store } from 'lucide-react';

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button key={s} type="button" onClick={() => !readonly && onChange(s)} disabled={readonly}
        className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}>
        <Star className={`w-7 h-7 ${s <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
      </button>
    ))}
  </div>
);

const BeneficiaryRatings = () => {
  const [myShop, setMyShop] = useState(null);
  const [allRatings, setAllRatings] = useState([]);
  const [form, setForm] = useState({ rating: 0, feedback: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const shopRes = await axios.get('/users/my-shop').catch(() => ({ data: { data: null } }));
      setMyShop(shopRes.data.data);
      if (shopRes.data.data?._id) {
        const ratingsRes = await axios.get(`/shops/${shopRes.data.data._id}/ratings`).catch(() => ({ data: { data: [] } }));
        setAllRatings(ratingsRes.data.data || []);
      }
    } catch {
      toast.error('Failed to load data');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await axios.post(`/shops/${myShop._id}/rate`, form);
      toast.success('Rating submitted successfully');
      setForm({ rating: 0, feedback: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!myShop) return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-12 text-center">
      <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500 dark:text-gray-400">No shop assigned to you yet</p>
    </div>
  );

  const avgRating = allRatings.length > 0 ? allRatings.reduce((a, r) => a + r.rating, 0) / allRatings.length : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rate Your Shop</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white">{myShop.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={Math.round(avgRating)} readonly />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {avgRating.toFixed(1)} ({allRatings.length} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Submit Your Rating</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Rating</label>
            <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback (optional)</label>
            <textarea rows={3} placeholder="Share your experience..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting || form.rating === 0}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      </div>

      {allRatings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> All Reviews ({allRatings.length})
          </h3>
          <div className="space-y-4">
            {allRatings.map(r => (
              <div key={r._id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 dark:text-white text-sm">{r.ratedBy?.name || 'Anonymous'}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <StarRating value={r.rating} readonly />
                {r.feedback && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{r.feedback}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryRatings;
