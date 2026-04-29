import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function PostCard({ post }) {
  const { data } = useContent();
  const category = data.categories.find(c => c.id === post.categoryId);
  
  return (
    <Link to={`/post/${post.slug || post.id}`} className="group flex flex-col bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category?.icon || '📝'}</span>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            {category?.name || '정보'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          {post.date}
        </span>
      </div>
      <h3 className="text-sm md:text-base font-black text-slate-800 leading-snug mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
        {post.title}
      </h3>
      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 mt-auto">
        {post.summary}
      </p>
    </Link>
  );
}
