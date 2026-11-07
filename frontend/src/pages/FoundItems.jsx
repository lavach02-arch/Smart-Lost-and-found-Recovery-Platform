import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { fetchItems } from '../services/api';

export default function FoundItems() {
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

  const loadFoundItems = async () => {
    setLoading(true);
    try {
      const res = await fetchItems({
        status: 'found',
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
      console.error('[FoundItems Fetch Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoundItems();
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
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Found Items Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Reported Found Items
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Browse through items that have been safely recovered and are waiting to be claimed by their owners.
          </p>
        </div>

        <Link
          to="/found-items/report"
          className="px-5 py-3 rounded-xl text-xs font-bold text-blue-900 bg-white hover:bg-blue-50 transition-all flex items-center space-x-1.5 shadow-md shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Report Found Item</span>
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
          placeholder="Search found items by title, description, category, or location..."
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
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-semibold">
            Filtered by Category: {selectedCategory}
          </span>
        )}
      </div>

      {/* Content Section */}
      {loading ? (
        <LoadingSpinner message="Searching found item reports..." />
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
          title="No found items available"
          description="Have you found something? Help return it to its rightful owner."
          actionText="Report Found Item"
          actionLink="/found-items/report"
          onReset={handleResetFilters}
        />
      )}
    </div>
  );
}
