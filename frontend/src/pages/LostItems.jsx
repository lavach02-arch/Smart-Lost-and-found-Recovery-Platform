import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, PlusCircle } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { fetchItems } from '../services/api';

export default function LostItems() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const loadLostItems = async () => {
    setLoading(true);
    try {
      const res = await fetchItems({
        status: 'lost',
        category: selectedCategory,
        location: selectedLocation,
        search: searchTerm,
        page: currentPage,
        limit: 9,
      });

      if (res.success) {
        setItems(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalCount(res.pagination.totalItems || res.data.length);
        }
      }
    } catch (err) {
      console.error('[LostItems Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLostItems();
  }, [selectedCategory, selectedLocation, searchTerm, selectedDateRange, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLocation('');
    setSelectedDateRange('all');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Lost Items Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Reported Lost Items
          </h1>
          <p className="text-amber-100 text-sm leading-relaxed">
            Search through items reported as lost across the campus and community.
          </p>
        </div>

        <Link
          to="/lost-items/report"
          className="px-5 py-3 rounded-xl text-xs font-bold text-amber-900 bg-white hover:bg-amber-50 transition-all flex items-center space-x-1.5 shadow-md shrink-0"
        >
          <Search className="w-4 h-4 text-amber-600" />
          <span>Report Lost Item</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search lost items by title, description, category, or location..."
        />

        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={(val) => {
            setSelectedCategory(val);
            setCurrentPage(1);
          }}
          selectedLocation={selectedLocation}
          setSelectedLocation={(val) => {
            setSelectedLocation(val);
            setCurrentPage(1);
          }}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={(val) => {
            setSelectedDateRange(val);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
        />
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-900">{totalCount}</strong> {totalCount === 1 ? 'report' : 'reports'}
        </span>
        {selectedCategory !== 'All' && (
          <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200 font-semibold">
            Filtered by Category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Content Section */}
      {loading ? (
        <LoadingSpinner message="Searching lost item reports..." />
      ) : items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ItemCard key={item._id || item.id} item={item} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <EmptyState
          title="No lost items found"
          description="No lost items matched your query. Be the first person to report a lost item."
          actionText="Report Lost Item"
          actionLink="/lost-items/report"
          onReset={handleResetFilters}
        />
      )}
    </div>
  );
}
