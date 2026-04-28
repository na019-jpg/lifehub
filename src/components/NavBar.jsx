import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function NavBar() {
  const { pathname } = useLocation();
  const { data } = useContent();

  // Filter categories that have at least 1 post
  const activeCategories = data.categories.filter(category => 
    data.posts.some(post => post.categoryId === category.id)
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-800 shrink-0">
            <span className="text-2xl">🌿</span> LifeHub
          </Link>
          <div className="hidden md:flex gap-6 font-bold text-slate-600 text-sm items-center">
            <Link to="/" className={`hover:text-indigo-600 transition-colors ${pathname === '/' ? 'text-indigo-600' : ''}`}>홈</Link>
            {activeCategories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.id}`} 
                className={`hover:text-indigo-600 transition-colors ${pathname === `/category/${cat.id}` ? 'text-indigo-600 font-black' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Mobile Nav Links: Horizontal scroll */}
        <div 
          className="md:hidden flex gap-5 py-3 border-t border-slate-100 text-sm font-bold text-slate-600 overflow-x-auto"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <Link to="/" className={`shrink-0 hover:text-indigo-600 transition-colors ${pathname === '/' ? 'text-indigo-600' : ''}`}>전체 보기</Link>
          {activeCategories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.id}`} 
              className={`shrink-0 hover:text-indigo-600 transition-colors ${pathname === `/category/${cat.id}` ? 'text-indigo-600 font-black' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
