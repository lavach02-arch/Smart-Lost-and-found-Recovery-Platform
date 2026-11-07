import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileCheck, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { title: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { title: 'User Management', path: '/admin/users', icon: Users },
    { title: 'Item Listings', path: '/admin/items', icon: Package },
    { title: 'Recovery Requests', path: '/admin/recovery-requests', icon: FileCheck },
    { title: 'Reported Listings', path: '/admin/reports', icon: AlertTriangle },
    { title: 'Audit Activity', path: '/admin/activity', icon: Activity },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white rounded-3xl p-5 shadow-xl shrink-0 space-y-6">
      {/* Sidebar Title */}
      <div className="flex items-center space-x-3 px-2 pb-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Admin Console</h3>
          <p className="text-[10px] text-slate-400 font-medium">SmartFind Management</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
