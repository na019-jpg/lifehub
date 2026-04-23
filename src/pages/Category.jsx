import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoHelmet from '../components/SeoHelmet';
import PostCard from '../components/PostCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { useContent } from '../contexts/ContentContext';

export default function Category() {
  const { categoryId } = useParams();
  const { data } = useContent();
  const [activeSubcategory, setActiveSubcategory] = useState('전체');
  
  const category = data.categories.find(c => c.id === categoryId);
  const posts = data.posts.filter(p => p.categoryId === categoryId).sort((a, b) => new Date(b.date) - new Date(a.date));

  const subcategories = ['전체', ...new Set(posts.map(p => p.subcategory).filter(Boolean))];
  const displayedPosts = activeSubcategory === '전체' ? posts : posts.filter(p => p.subcategory === activeSubcategory);

  if (!category) {
    return (
      <div className="container mx-auto text-center py-32 px-4 min-h-[60vh]">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">존재하지 않는 카테고리입니다.</h2>
        <Link to="/" className="inline-block bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-screen">
      <SeoHelmet 
        title={`${category.icon} ${category.name}`} 
        description={`${category.name} 관련 생활 정보 및 꿀팁`}
        keywords={`${category.name}, 정보, 꿀팁, 매일 생활`}
      />
      
      <div className="bg-white border-2 border-slate-100 rounded-3xl p-10 mb-10 text-center shadow-sm relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 relative z-10">{category.icon} {category.name}</h1>
        <p className="text-lg text-slate-500 font-medium relative z-10">{category.name} 카테고리의 모든 글을 모아보세요.</p>
      </div>

      {subcategories.length > 1 && (
        <div className="flex overflow-x-auto gap-3 pb-4 mb-6 hide-scrollbar">
          {subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubcategory(sub)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all shadow-sm ${
                activeSubcategory === sub 
                  ? 'bg-slate-800 text-white border-2 border-slate-800' 
                  : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <AdPlaceholder position="카테고리 리스트 인피드 광고" />

      {displayedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {displayedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 mt-6">
          <p className="text-slate-500 font-medium text-lg mb-2">아직 등록된 꿀팁이 없네요!</p>
          <p className="text-slate-400 text-sm">유용한 정보가 곧 업데이트될 예정입니다.</p>
        </div>
      )}
    </div>
  );
}
