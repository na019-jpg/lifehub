import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function NavBar() {
  const { pathname } = useLocation();
  const { data } = useContent();

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-800">
            <span className="text-2xl">🌿</span> LifeHub
          </Link>
          <div className="hidden md:flex gap-6 font-semibold text-slate-600 text-sm items-center">
            <Link to="/" className="hover:text-blue-600 transition-colors">홈</Link>
          </div>
        </div>
        {/* Mobile Nav Links (Optional context-based simple links instead of horizontal categories) */}
        <div className="md:hidden flex gap-4 py-3 border-t border-slate-100 text-sm font-semibold text-slate-600 justify-center">
           <Link to="/" className={`hover:text-blue-600 transition-colors ${pathname === '/' ? 'text-blue-600' : ''}`}>홈 화면</Link>
        </div>
      </div>
    </nav>
  );
}
