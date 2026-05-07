import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CATEGORIES = [
  { id: 'career', name: '직장/커리어', icon: '💼', path: '/tools/turnover-calc' },
  { id: 'finance', name: '생활/자산', icon: '💰', path: '/tools/subscription-manager' },
];

export default function ToolTabs({ activeCategory }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-white border-b border-slate-100 sticky top-0 z-50 overflow-x-auto no-scrollbar">
      <div className="container mx-auto max-w-2xl px-6 flex items-center gap-6 py-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => navigate(cat.path)}
            className={`flex items-center gap-2 pb-2 whitespace-nowrap transition-all relative ${activeCategory === cat.id ? 'text-[#1A237E]' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-sm font-black tracking-tight">{cat.name}</span>
            {activeCategory === cat.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2E7D32] rounded-full animate-in fade-in duration-300"></div>
            )}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 pl-6 border-l border-slate-100">
           <button onClick={() => navigate('/')} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001.1 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
           </button>
        </div>
      </div>
    </div>
  );
}
