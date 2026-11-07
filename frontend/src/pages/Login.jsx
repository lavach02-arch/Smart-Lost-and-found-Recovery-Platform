import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2, LogIn, Compass, CheckCircle2 } from 'lucide-react';
import VantaBackground from '../components/VantaBackground';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden grid grid-cols-1 md:grid-cols-12 backdrop-blur-xl">
        
        {/* Left Branding / Information Banner with 3D Shader Animation */}
        <VantaBackground
          className="md:col-span-5 p-8 sm:p-10 text-white flex flex-col justify-between"
          options={{
            backgroundColor: 0x0f172a,
            baseColor: 0x2563eb,
            amplitudeFactor: 1.3,
            size: 1.3,
          }}
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-6 border border-white/20">
              <Compass className="w-6 h-6" />
            </div>
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-4 text-blue-200 border border-white/10">
              SmartFind Platform
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Welcome Back 👋
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Login to access your SmartFind dashboard, manage recovery requests, and trace your lost items.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center space-x-3 text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Real-time item status tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Automated item matching system</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span>Verified recovery verification</span>
            </div>
          </div>
        </VantaBackground>

        {/* Right Form Container */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/90 text-white">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white">Sign In</h3>
            <p className="text-sm text-slate-400 mt-1">Enter your credentials to access your account.</p>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition-all disabled:bg-slate-900"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition-all disabled:bg-slate-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
              Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
