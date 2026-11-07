import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Smart<span className="text-blue-400">Find</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Lost it? Found it? SmartFind brings them together. An intelligent recovery platform designed to reunite people with their missing possessions seamlessly.
            </p>
            <div className="flex items-center space-x-2 text-xs text-blue-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 w-fit">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Phase 1 Architecture Foundation Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/lost-items" className="hover:text-white transition-colors">Lost Items Directory</Link>
              </li>
              <li>
                <Link to="/found-items" className="hover:text-white transition-colors">Found Items Directory</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About SmartFind</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Popular Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Electronics & Devices</li>
              <li>Wallets & Cards</li>
              <li>Keys & Remotes</li>
              <li>Bags & Luggage</li>
              <li>Personal Documents</li>
            </ul>
          </div>

          {/* Contact Placeholder */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support & Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@smartfind.demo</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+1 (800) 555-FIND</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>SmartFind HQ, Innovation Hub</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} SmartFind Recovery Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-slate-400">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Phase 1 Demo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
