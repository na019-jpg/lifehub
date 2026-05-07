import React from 'react';
import { Link } from 'react-router-dom';

export default function ToolCard({ tool }) {
  return (
    <Link 
      to={tool.path}
      className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full"
    >
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
        {tool.icon}
      </div>
      <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
        {tool.name}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed flex-grow">
        {tool.description}
      </p>
      <div className="mt-6 flex items-center text-blue-600 font-bold text-sm">
        바로 사용하기
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
