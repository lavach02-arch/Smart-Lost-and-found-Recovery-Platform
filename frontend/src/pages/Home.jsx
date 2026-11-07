import React from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Zap, Layers } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import CategoryCard from '../components/CategoryCard';
import StatCard from '../components/StatCard';
import AnimatedTopDock from '../shaders/animated-top-dock/AnimatedTopDock';
import { MOCK_ITEMS, CATEGORIES, SAMPLE_STATS } from '../data/mockData';

export default function Home() {
  const { onOpenReportModal } = useOutletContext();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/lost-items?category=${encodeURIComponent(categoryName)}`);
  };

  // Recent items (take top 6)
  const recentItems = MOCK_ITEMS.slice(0, 6);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24 bg-slate-900/60 backdrop-blur-xl overflow-hidden border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Phase 1 Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span>SmartFind Platform Active</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find What Matters.{' '}
            <span className="gradient-text">Return What Belongs.</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            SmartFind connects people who have lost items with people who have found them through an organized recovery platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenReportModal('Report Lost Item', 'Phase 3')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base"
            >
              <Search className="w-5 h-5" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => onOpenReportModal('Report Found Item', 'Phase 3')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Report Found Item</span>
            </button>
          </div>

          {/* Subtext info */}
          <p className="text-xs text-slate-400 font-medium pt-2">
            No signup required to view directory • Instant search & filter capabilities
          </p>
        </div>
      </section>

      {/* Animated Top Dock Liquid Glass Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h2 className="text-2xl font-bold text-white">Interactive Navigation System</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Liquid Glass Shader Interface
          </p>
        </div>
        <div className="relative w-full h-[450px] sm:h-[520px] rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-950">
          <AnimatedTopDock
            variant="glass"
            particles={22}
            thickness={0.115}
            dispersion={0.050}
            specular={0.85}
            rim={0.50}
            drift={1.00}
            proximity={44}
            heightGrowth={20}
            drop={11.0}
          />
        </div>
      </section>

      {/* Sample Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white">Platform Activity Overview</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            Live Statistics & Metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900/60 backdrop-blur-xl py-16 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white">How SmartFind Works</h2>
            <p className="text-slate-300 text-sm mt-2">
              Three simple steps to reunite lost possessions with their rightful owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4 relative backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Report</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Submit details, photos, category, location, and date of the lost or found item.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4 relative backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Match</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                SmartFind algorithms analyze descriptions, locations, and timeframes to propose matches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4 relative backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-extrabold text-xl flex items-center justify-center mx-auto shadow-sm">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Recover</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Verify ownership safely and coordinate handoff or secure retrieval.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Browse Categories</h2>
            <p className="text-slate-300 text-sm mt-1">
              Explore reported items grouped by item classification
            </p>
          </div>
          <Link 
            to="/lost-items" 
            className="mt-4 md:mt-0 text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
          >
            <span>View All Directories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </section>

      {/* Recent Reports Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-extrabold text-white">Recent Reports</h2>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Directory
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Latest lost and found listings uploaded to the platform
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Link
              to="/lost-items"
              className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold rounded-xl text-xs border border-amber-500/30 transition-colors"
            >
              View Lost Directory
            </Link>
            <Link
              to="/found-items"
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold rounded-xl text-xs border border-emerald-500/30 transition-colors"
            >
              View Found Directory
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
}
