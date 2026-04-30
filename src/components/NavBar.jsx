import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function NavBar() {
  const { pathname } = useLocation();
  const { data } = useContent();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(searchQuery)}`);
  };

  // Filter categories that have at least 1 post
  const activeCategories = data.categories.filter(category => 
    data.posts.some(post => post.categoryId === category.id)
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col">
          {/* Top Row: Logo and Search */}
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-800 shrink-0 hover:text-indigo-600 transition-colors">
              <span className="text-2xl">🌿</span> LifeHub
            </Link>
            
            <form onSubmit={handleSearch} className="relative max-w-xs w-full ml-4 hidden sm:block">
              <input 
                type="text" 
                placeholder="검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </form>
          </div>

          {/* Bottom Row: Category Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link 
              to="/" 
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-bold transition-all ${
                pathname === '/' && !searchParams.get('cat')
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              전체
            </Link>
            {activeCategories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/?cat=${cat.id}`}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  searchParams.get('cat') === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

