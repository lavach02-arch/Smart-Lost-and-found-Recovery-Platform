import React, { useState } from 'react';
import { Tag, MapPin, Calendar, Clock, Image, FileText, AlertCircle, Loader2, Send } from 'lucide-react';

export const CATEGORIES = [
  'Electronics',
  'Mobile Phones',
  'Laptops',
  'Wallets',
  'Bags',
  'Documents',
  'ID Cards',
  'Keys',
  'Jewelry',
  'Clothing',
  'Books',
  'Accessories',
  'Other',
];

export default function ItemForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitText = 'Submit Report',
  statusType = 'lost',
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    category: initialData.category || CATEGORIES[0],
    description: initialData.description || '',
    location: initialData.location || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    time: initialData.time || '',
    additionalDetails: initialData.additionalDetails || '',
    image: initialData.image || '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!formData.title.trim()) return 'Item title is required';
    if (!formData.category) return 'Category is required';
    if (!formData.description.trim()) return 'Detailed description is required';
    if (!formData.location.trim()) return 'Location is required';
    if (!formData.date) return 'Date is required';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validationErr = validate();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    onSubmit(formData);
  };

  const isLost = statusType === 'lost';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 space-y-6">
      
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-700 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Item Title & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
        <div className="sm:col-span-7">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Item Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={isLost ? "e.g. Black Samsung Galaxy Phone" : "e.g. Silver AirPods Case"}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
            required
          />
        </div>

        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Category <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all appearance-none bg-white"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder={
            isLost
              ? "Provide detailed features (e.g. Color, brand, unique marks, case color)..."
              : "Describe the condition and specific identifying features of the item found..."
          }
          disabled={isSubmitting}
          className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
          required
        ></textarea>
      </div>

      {/* Location, Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Guntur Bus Stand"
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Time (Approximate)
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Image URL & Additional Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Image URL
          </label>
          <div className="relative">
            <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Leave empty to use a standard category fallback image.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Additional Details (Optional)
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              placeholder="e.g. Small scratch on screen, distinct sticker..."
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-medium outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95 disabled:opacity-70 ${
            isLost
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-500/25'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Report...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{submitText}</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}
