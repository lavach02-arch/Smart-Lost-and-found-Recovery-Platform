import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';

export default function ItemCard({ item }) {
  const isLost = item.status === 'lost';
  const itemId = item.id || item._id;

  return (
    <div className="group bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1 backdrop-blur-md">
      
      {/* Image & Status Badge Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={isLost ? 'badge-lost' : 'badge-found'}>
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          {item.reward && (
            <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-md">
              {item.reward}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Pill */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium mb-2">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>{item.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Details Meta & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <Link
            to={`/item/${itemId}`}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 group-hover:border-transparent border border-slate-700"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
