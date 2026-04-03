import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const RATION_ITEMS = [
  { name: 'Rice', unit: 'kg', defaultPrice: 20 },
  { name: 'Wheat', unit: 'kg', defaultPrice: 25 },
  { name: 'Sugar', unit: 'kg', defaultPrice: 40 },
  { name: 'Kerosene', unit: 'litre', defaultPrice: 50 },
  { name: 'Cooking Oil', unit: 'litre', defaultPrice: 120 }
];

const DistributionModal = ({ beneficiary, onClose, onSuccess }) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const [items, setItems] = useState(
    RATION_ITEMS.map(item => ({
      ...item,
      quantity: 0,
      price: 0
    }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkDuplicate();
  }, []);

  const checkDuplicate = async () => {
    try {
      const { data } = await axios.get(
        `/api/distribution/check-duplicate/${beneficiary._id}/${currentMonth}/${currentYear}`
      );
      
      if (data.isDuplicate) {
        toast.error('Ration already distributed to this beneficiary this month!');
        setTimeout(onClose, 2000);
      }
    } catch (error) {
      console.error('Error checking duplicate:', error);
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...items];
    newItems[index].quantity = parseFloat(quantity) || 0;
    newItems[index].price = newItems[index].quantity * newItems[index].defaultPrice;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const distributedItems = items.filter(item => item.quantity > 0);
    
    if (distributedItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/distribution', {
        beneficiaryId: beneficiary._id,
        items: distributedItems,
        month: currentMonth,
        year: currentYear
      });

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record distribution');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Record Distribution
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Beneficiary</p>
            <p className="font-bold text-gray-800 dark:text-white">{beneficiary.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ration Card: {beneficiary.rationCardNumber}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Family Members: {beneficiary.familyMembers}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </label>
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder={`${item.unit}`}
                      className="input-field"
                      value={item.quantity || ''}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800 dark:text-white">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || totalAmount === 0}
                className="flex-1 btn-primary"
              >
                {loading ? 'Recording...' : 'Record Distribution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DistributionModal;
