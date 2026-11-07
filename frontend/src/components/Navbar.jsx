import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Menu, X, Activity, Compass, User, LogOut, LogIn, UserPlus, ListFilter, LayoutDashboard, FileCheck, Bell } from 'lucide-react';
import { checkApiHealth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Ping backend health check on mount
  useEffect(() => {
    let isMounted = true;
    checkApiHealth().then((res) => {
      if (isMounted) {
        setApiConnected(res.connected);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-800/80 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Smart<span className="text-blue-400">Find</span>
                </span>
                {/* Backend Health Badge */}
                <span
                  className={`hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    apiConnected === true
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : apiConnected === false
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title={apiConnected ? 'Backend API Online' : 'Backend Offline'}
                >
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>{apiConnected === true ? 'API Active' : apiConnected === false ? 'Demo Mode' : 'Checking...'}</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden md:block">
                Lost it? Found it? SmartFind brings them together.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 text-xs font-semibold backdrop-blur-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/lost-items"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
              }
            >
              Lost Items
            </NavLink>

            <NavLink
              to="/found-items"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
              }
            >
              Found Items
            </NavLink>

            {!isAuthenticated && (
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
                }
              >
                About
              </NavLink>
            )}

            {isAuthenticated && (
              <>
                <NavLink
                  to="/lost-items/report"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition-all text-amber-400 hover:bg-amber-500/10 ${isActive ? 'bg-amber-500/20 border border-amber-500/30' : ''}`
                  }
                >
                  Report Lost
                </NavLink>

                <NavLink
                  to="/found-items/report"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition-all text-blue-400 hover:bg-blue-500/10 ${isActive ? 'bg-blue-500/20 border border-blue-500/30' : ''}`
                  }
                >
                  Report Found
                </NavLink>

                <NavLink
                  to="/my-reports"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
                  }
                >
                  My Reports
                </NavLink>

                <NavLink
                  to="/recovery-requests"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
                  }
                >
                  Requests
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg transition-all ${isActive ? 'bg-slate-800 text-blue-400 border border-slate-700/50 shadow-sm' : 'text-slate-300 hover:text-white'}`
                  }
                >
                  Profile
                </NavLink>

                {user?.role === 'ADMIN' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-lg transition-all font-bold ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-300 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30'}`
                    }
                  >
                    Admin Dashboard
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Auth & Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <NotificationBell />

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-200 max-w-[90px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all flex items-center space-x-1 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center space-x-1 shadow-lg shadow-blue-500/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="xl:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link to="/profile" className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-slideDown">
          <div className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/lost-items"
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
              }
            >
              Lost Items
            </NavLink>
            <NavLink
              to="/found-items"
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
              }
            >
              Found Items
            </NavLink>

            {!isAuthenticated && (
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
                }
              >
                About
              </NavLink>
            )}

            {isAuthenticated && (
              <>
                <NavLink
                  to="/lost-items/report"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors text-amber-400 ${isActive ? 'bg-amber-500/20 font-semibold' : 'hover:bg-slate-800/60'}`
                  }
                >
                  Report Lost Item
                </NavLink>

                <NavLink
                  to="/found-items/report"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors text-blue-400 ${isActive ? 'bg-blue-500/20 font-semibold' : 'hover:bg-slate-800/60'}`
                  }
                >
                  Report Found Item
                </NavLink>

                <NavLink
                  to="/my-reports"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
                  }
                >
                  My Reports
                </NavLink>

                <NavLink
                  to="/recovery-requests"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
                  }
                >
                  Recovery Requests
                </NavLink>

                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
                  }
                >
                  Notifications
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/60'}`
                  }
                >
                  Profile
                </NavLink>

                {user?.role === 'ADMIN' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-base font-bold transition-colors text-indigo-300 bg-indigo-500/20 ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-500/30'}`
                    }
                  >
                    Admin Dashboard
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-3 text-center text-sm font-semibold text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/30 flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({user?.name})</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 px-3 text-center text-sm font-semibold text-slate-200 bg-slate-800 rounded-xl border border-slate-700 block"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full py-2.5 px-3 text-center text-sm font-semibold text-white bg-blue-600 rounded-xl block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
