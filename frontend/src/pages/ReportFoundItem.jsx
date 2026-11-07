import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createFoundItem } from '../services/api';
import ItemForm from '../components/ItemForm';
import { PlusCircle } from 'lucide-react';

export default function ReportFoundItem() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await createFoundItem(formData, token);
      if (res.success) {
        navigate('/found-items');
      }
    } catch (err) {
      console.error('[ReportFoundItem Error]', err);
      const msg = err.message || 'Failed to submit found item report';
      if (msg.includes('Authentication required') || msg.includes('User not found') || msg.includes('token')) {
        alert('Your session has expired or authentication is required. Please sign in to continue.');
        logout();
        navigate('/login');
      } else {
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Found Item Submission</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Report a Found Item
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Provide the details of the item you found to help connect it back to its rightful owner.
          </p>
        </div>
      </div>

      <ItemForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText="Report Found Item"
        statusType="found"
      />
    </div>
  );
}
