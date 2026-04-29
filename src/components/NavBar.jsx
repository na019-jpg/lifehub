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
        <div className="flex items-center justify-center md:justify-start h-16">
          <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-800 shrink-0 hover:text-indigo-600 transition-colors">
            <span className="text-2xl">🌿</span> LifeHub
          </Link>
        </div>
      </div>
    </nav>
  );
}
