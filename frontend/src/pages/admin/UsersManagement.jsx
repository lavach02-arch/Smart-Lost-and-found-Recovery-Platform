import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminUsers, updateUserStatus, updateUserRole, deleteAdminUser } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Search, UserCheck, UserX, Shield, User, Trash2 } from 'lucide-react';

export default function UsersManagement() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Role change modal state
  const [roleTargetUser, setRoleTargetUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchUsers = async (page = currentPage) => {
    setLoading(true);
    try {
      const res = await getAdminUsers(token, {
        search,
        role: roleFilter,
        status: statusFilter,
        page,
        limit: 10,
      });
      if (res.success) {
        setUsers(res.users || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error('[UsersManagement fetch error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter, token]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleToggleStatus = async (user) => {
    const targetStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await updateUserStatus(user._id, targetStatus, token);
      if (res.success) fetchUsers(currentPage);
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!roleTargetUser || !newRole) return;
    try {
      const res = await updateUserRole(roleTargetUser._id, newRole, token);
      if (res.success) {
        setRoleTargetUser(null);
        fetchUsers(currentPage);
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteAdminUser(deleteTargetId, token);
      if (res.success) {
        setDeleteTargetId(null);
        fetchUsers(currentPage);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <AdminSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">User Management</h1>
              <p className="text-xs text-slate-500">Monitor users, update roles, or suspend accounts.</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>

          {/* Users Table */}
          {loading ? (
            <LoadingSpinner message="Loading user records..." />
          ) : users.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {users.map((u) => {
                      const isSelf = u._id === (currentUser?._id || currentUser?.id);
                      return (
                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{u.name}</span>
                                <span className="text-slate-400 text-[11px]">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                u.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border-rose-200'
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>

                          <td className="p-4 text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>

                          <td className="p-4 text-right space-x-2">
                            {!isSelf && (
                              <>
                                <button
                                  onClick={() => {
                                    setRoleTargetUser(u);
                                    setNewRole(u.role === 'ADMIN' ? 'USER' : 'ADMIN');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-all"
                                >
                                  Role ({u.role === 'ADMIN' ? 'USER' : 'ADMIN'})
                                </button>

                                <button
                                  onClick={() => handleToggleStatus(u)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                    u.status === 'ACTIVE'
                                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                  }`}
                                >
                                  {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                                </button>

                                <button
                                  onClick={() => setDeleteTargetId(u._id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-all inline-flex align-middle"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-xs text-slate-500">No matching user records found.</p>
            </div>
          )}
        </main>
      </div>

      {/* Role Change Modal */}
      <ConfirmDialog
        isOpen={!!roleTargetUser}
        title={`Change User Role for ${roleTargetUser?.name}?`}
        message={`Are you sure you want to change role from ${roleTargetUser?.role} to ${newRole}?`}
        onConfirm={handleConfirmRoleChange}
        onCancel={() => setRoleTargetUser(null)}
      />

      {/* Delete User Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete User Account?"
        message="This action cannot be undone and will remove the user account permanently."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
