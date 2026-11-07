import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getItemMatches } from '../services/api';
import MatchCard from '../components/MatchCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Sparkles, ArrowLeft, MapPin, Calendar, Tag, ShieldCheck } from 'lucide-react';

export default function Matches() {
  const { itemId } = useParams();
  const { token } = useAuth();

  const [targetItem, setTargetItem] = useState(null);
  const [oppositeStatus, setOppositeStatus] = useState('found');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const res = await getItemMatches(itemId, token);
        if (res.success) {
          setTargetItem(res.item);
          setOppositeStatus(res.oppositeStatus || 'found');
          setMatches(res.matches || []);
        } else {
          setError(res.message || 'Failed to calculate potential matches');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch potential matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [itemId, token]);

  if (loading) {
    return <LoadingSpinner message="Calculating potential item matches via SmartFind Engine..." />;
  }

  if (error || !targetItem) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Matches Not Available</h2>
        <p className="text-xs text-slate-500">{error || 'Target report not found'}</p>
        <Link
          to="/my-reports"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Reports</span>
        </Link>
      </div>
    );
  }

  const isLost = targetItem.status === 'lost';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Back Button */}
      <div className="space-y-4">
        <Link
          to={`/item/${itemId}`}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Item Details</span>
        </Link>

        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-teal-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Matching Engine</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Potential Item Matches
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Calculated weighted similarity suggestions comparing your {isLost ? 'lost' : 'found'} report with opposite-status reports.
            </p>
          </div>
        </div>
      </div>

      {/* Target Report Card Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Your Reported Item
        </span>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <StatusBadge status={targetItem.status} />
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {targetItem.category}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">{targetItem.title}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{targetItem.location}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
            <span>{targetItem.date}</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="font-semibold text-slate-900">{matches.length} Potential Matches Found</span>
          </div>
        </div>
      </div>

      {/* Matches Listing Gallery */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Potential {oppositeStatus === 'found' ? 'Found' : 'Lost'} Matches ({matches.length})
          </h2>
          <span className="text-xs font-medium text-slate-500">
            Sorted by Highest Similarity Match Score
          </span>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match, idx) => (
              <MatchCard key={match.item._id || match.item.id || idx} match={match} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No potential matches found"
            description={`We compared your report against existing ${oppositeStatus} reports, but no items scored above the 40% similarity threshold. New reports are continuously monitored.`}
            actionText="View My Reports"
            actionLink="/my-reports"
          />
        )}
      </div>

    </div>
  );
}
