import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function PostCard({ post }) {
  const { data } = useContent();
  const category = data.categories.find(c => c.id === post.categoryId);
  
  return (
    <Link to={`/post/${post.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200 h-full">
      <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
        {post.thumbnailUrl ? (
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-5xl text-slate-300">{category?.icon || '📝'}</div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 bg-slate-50 px-2.5 py-1 rounded">
            {category?.name || '정보'}
          </span>
          <span className="text-[13px] text-slate-400 font-medium">
            {post.date}
          </span>
        </div>
        <h3 className="text-[19px] md:text-xl font-black text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        <p className="text-[15px] md:text-base text-slate-500 leading-relaxed line-clamp-2">
          {post.summary}
        </p>
      </div>
    </Link>
  );
}
