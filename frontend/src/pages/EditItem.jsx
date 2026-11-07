import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItemById, updateItem } from '../services/api';
import ItemForm from '../components/ItemForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { Edit3, AlertCircle } from 'lucide-react';

export default function EditItem() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getItemById(id);
        if (res.success && res.data) {
          setItem(res.data);
          // Check ownership
          const ownerId = res.data.owner?._id || res.data.owner?.id || res.data.owner;
          const currentUserId = user?.id || user?._id;
          if (ownerId && currentUserId && ownerId !== currentUserId) {
            setError('You are not authorized to edit this report.');
          }
        } else {
          setError('Item report not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, user]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await updateItem(id, formData, token);
      if (res.success) {
        navigate(`/item/${id}`);
      }
    } catch (err) {
      console.error('[EditItem Error]', err);
      alert(err.message || 'Failed to update item report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching report details for editing..." />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <button
          onClick={() => navigate('/my-reports')}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs shadow-md"
        >
          Return to My Reports
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Mode</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Edit Item Report
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Update location, description, or images for "{item?.title}".
          </p>
        </div>
      </div>

      <ItemForm
        initialData={item}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitText="Save Changes"
        statusType={item?.status}
      />
    </div>
  );
}
