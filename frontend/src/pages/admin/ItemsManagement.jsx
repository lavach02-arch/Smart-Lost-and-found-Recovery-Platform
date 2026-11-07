import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminItems, deleteAdminItem } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';
import { Search, Eye, Trash2, MapPin, Calendar, User } from 'lucide-react';

const CATEGORIES = [
  'Mobile Phones',
  'Wallets & Purses',
  'Bags & Backpacks',
  'Documents & Cards',
  'Keys',
  'Electronics & Gadgets',
  'Jewelry & Watches',
  'Clothing & Accessories',
  'Pets',
  'Other',
];

export default function ItemsManagement() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchItems = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await getAdminItems(token, {
        search,
        status: typeFilter,
        category: categoryFilter,
        page,
        limit: 10,
      });
      if (res.success) {
        setItems(res.items || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('[ItemsManagement fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
    setCurrentPage(1);
  }, [search, typeFilter, categoryFilter, token]);

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteAdminItem(deleteTargetId, token);
      if (res.success) {
        setDeleteTargetId(null);
        fetchItems(currentPage);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <AdminSidebar />

        <main className="flex-1 w-full space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Item Listings Management</h1>
            <p className="text-xs text-slate-500">Monitor all reported lost and found items on the platform.</p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search item title or location..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Item Types</option>
              <option value="lost">Lost Items</option>
              <option value="found">Found Items</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Items Table */}
          {loading ? (
            <LoadingSpinner message="Loading reported listings..." />
          ) : items.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">Item Details</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                            />
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                                {item.title}
                              </span>
                              <span className="text-slate-400 text-[11px] block">{item.date}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <StatusBadge status={item.status} />
                        </td>

                        <td className="p-4 text-slate-700 font-semibold">{item.category}</td>

                        <td className="p-4 text-slate-600 truncate max-w-[140px]">{item.location}</td>

                        <td className="p-4 text-slate-600">{item.owner?.name || 'User'}</td>

                        <td className="p-4 text-right space-x-2">
                          <Link
                            to={`/item/${item._id}`}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all inline-flex align-middle"
                            title="View Item Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTargetId(item._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-all inline-flex align-middle"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500">No reported item listings found.</p>
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Item Listing?"
        message="This action will permanently delete this item report and remove it from candidate match searches."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
