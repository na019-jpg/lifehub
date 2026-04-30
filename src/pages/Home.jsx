import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import PostCard from '../components/PostCard';
import SeoHelmet from '../components/SeoHelmet';

export default function Home() {
  const { data } = useContent();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeCategory = searchParams.get('cat') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  // Handle category change via URL
  const handleCategoryClick = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') newParams.delete('cat');
    else newParams.set('cat', catId);
    newParams.delete('q'); // Clear search when switching categories
    setSearchParams(newParams);
    setActiveSubcategory('all');
  };

  // Handle search change via URL
  const handleSearchChange = (query) => {
    const newParams = new URLSearchParams(searchParams);
    if (!query) newParams.delete('q');
    else newParams.set('q', query);
    setSearchParams(newParams);
  };

  // Get current category object
  const currentCategoryObj = useMemo(() => {
    return activeCategory === 'all' ? null : data.categories.find(c => c.id === activeCategory);
  }, [activeCategory, data.categories]);

  const filteredPosts = useMemo(() => {
    return data.posts.filter(post => {
      // 1. 카테고리 필터
      const matchCategory = activeCategory === 'all' || post.categoryId === activeCategory;
      
      // 2. 서브 카테고리 필터
      let matchSubcategory = true;
      if (activeCategory !== 'all' && activeSubcategory !== 'all') {
        const subcategories = post.subcategories || [];
        matchSubcategory = subcategories.includes(activeSubcategory) || 
                          (post.tags && post.tags.includes(activeSubcategory));
      }
      
      // 3. 검색어 필터
      const query = searchQuery.toLowerCase();
      const matchSearch = !query || 
                          post.title.toLowerCase().includes(query) || 
                          post.summary.toLowerCase().includes(query) ||
                          (post.tags && post.tags.toLowerCase().includes(query));
                          
      return matchCategory && matchSubcategory && matchSearch;
    });
  }, [data.posts, activeCategory, activeSubcategory, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="LifeHub - 프리미엄 생활 매거진" 
        description="일상 속 모든 문제를 해결하는 오직 당신을 위한 프리미엄 가이드. 청소, 정리, 요리 꿀팁!"
        url={window.location.href}
        type="website"
      />
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative px-4 py-16 md:py-24 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 opacity-90 z-0"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-200 text-sm font-bold mb-6 tracking-widest border border-blue-500/30">
            PREMIUM 커뮤니티 꿀팁 사전
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
            오늘의 삶을 <span className="text-blue-400">10%</span> 더 쾌적하게.
          </h1>
          <p className="text-slate-300 text-[17px] md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            일상의 사소한 불편함부터 공간 혁신까지, <br className="hidden md:block" />에디터가 엄선한 최고의 해결책을 만나보세요.
          </p>

          {/* Search Bar inside Hero */}
          <div className="relative w-full max-w-xl mx-auto group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="무엇이 궁금하신가요? (예: 곰팡이 제거)" 
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-14 pr-6 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white focus:text-slate-900 focus:border-blue-400 rounded-full outline-none transition-all font-bold text-white placeholder-slate-300 shadow-xl text-[16px]"
            />
          </div>
        </div>
      </section>

      {/* 2. INLINE CATEGORY FILTER SECTION */}
      <section className="container mx-auto max-w-5xl px-4 pt-8 pb-2">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                activeCategory === 'all' 
                  ? 'bg-slate-800 text-white border-2 border-slate-800' 
                  : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              전체보기
            </button>
            {data.categories.map(c => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 transition-all shadow-sm ${
                  activeCategory === c.id 
                    ? 'bg-blue-600 text-white border-2 border-blue-600' 
                    : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>

          {activeCategory !== 'all' && currentCategoryObj && currentCategoryObj.subcategories?.length > 0 && (
            <div className="mt-3 p-3 bg-slate-100/70 rounded-2xl border border-slate-200/60 flex flex-wrap gap-2 animate-fade-in">
              <button
                onClick={() => setActiveSubcategory('all')}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all ${
                  activeSubcategory === 'all'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                전체
              </button>
              {currentCategoryObj.subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all ${
                    activeSubcategory === sub
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. MAIN FEED SECTION */}
      <main className="container mx-auto max-w-5xl px-4 pb-16">
        <div className="mb-4 flex justify-between items-end border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-lg font-black text-slate-800">
              {searchQuery ? `'${searchQuery}' 검색 결과` : 
               activeCategory === 'all' ? '전체 라이프스타일 매거진' : 
               activeSubcategory === 'all' ? `${currentCategoryObj?.name} 모음` :
               `${activeSubcategory} 포스팅`
              }
            </h2>
            <p className="text-slate-400 font-medium text-[11px] mt-0.5">총 {filteredPosts.length}개의 가이드가 있습니다.</p>
          </div>
          {(searchQuery || activeCategory !== 'all') && (
            <button 
              onClick={() => {handleCategoryClick('all');}}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
            >
              초기화 ✕
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <span className="text-5xl block mb-4 drop-shadow-md">🥲</span>
            <h3 className="text-xl font-black text-slate-700 mb-2">원하시는 결과가 없습니다</h3>
            <p className="text-slate-500 font-medium text-sm">검색어를 짧게 줄여보시거나, 필터 설정을 초기화해 보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} categoryName={data.categories.find(c => c.id === post.categoryId)?.name} />
            ))}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}} />
    </div>
  );
}

