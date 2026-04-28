import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import PostCard from '../components/PostCard';
import SeoHelmet from '../components/SeoHelmet';

export default function Home() {
  const { data } = useContent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle active category change
  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
  };

  const filteredPosts = useMemo(() => {
    return data.posts.filter(post => {
      // 1. 카테고리 필터
      const matchCategory = activeCategory === 'all' || post.categoryId === activeCategory;
      
      // 2. 검색어 필터
      const query = searchQuery.toLowerCase();
      const matchSearch = !query || 
                          post.title.toLowerCase().includes(query) || 
                          post.summary.toLowerCase().includes(query) ||
                          (post.tags && post.tags.toLowerCase().includes(query));
                          
      return matchCategory && matchSearch;
    });
  }, [data.posts, activeCategory, searchQuery]);

  // When no filters are active, we split into Trending and Recent
  const isFiltering = activeCategory !== 'all' || searchQuery !== '';
  const trendingPosts = useMemo(() => data.posts.slice(0, 3), [data.posts]);
  const recentPosts = useMemo(() => data.posts.slice(3), [data.posts]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="LifeHub - 프리미엄 생활 매거진" 
        description="일상 속 모든 문제를 해결하는 오직 당신을 위한 프리미엄 가이드. 청소, 정리, 요리 꿀팁!"
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
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white focus:text-slate-900 focus:border-blue-400 rounded-full outline-none transition-all font-bold text-white placeholder-slate-300 shadow-xl text-[16px]"
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY NAVIGATION BAR (BLOG STYLE) */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-2 md:gap-4 whitespace-nowrap snap-x">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`snap-start shrink-0 px-6 py-3 md:py-2.5 rounded-full font-bold transition-all text-[15px] md:text-[16px] border ${
                activeCategory === 'all' 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              전체보기
            </button>
            {data.categories.map(c => (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(c.id)}
                className={`snap-start shrink-0 px-6 py-3 md:py-2.5 rounded-full font-bold transition-all text-[15px] md:text-[16px] border flex items-center gap-1.5 ${
                  activeCategory === c.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CONTENT AREA */}
      <main className="container mx-auto max-w-5xl px-4 py-8">
        
        {!isFiltering ? (
          <>
            {/* TRENDING SECTION */}
            <section className="mb-16">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                  🔥 주간 인기글
                </h2>
                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Trending</span>
              </div>
              <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0 snap-x">
                {trendingPosts.map((post) => (
                  <div key={post.id} className="snap-start min-w-[85vw] sm:min-w-0 bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 group hover:shadow-2xl transition-all duration-300 flex-shrink-0 cursor-pointer">
                    <Link to={`/post/${post.slug}`}>
                      <div className="relative h-56 sm:h-48 overflow-hidden">
                        <img src={post.thumbnailUrl || 'https://via.placeholder.com/800x600?text=No+Image'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-[13px] font-black px-4 py-1.5 rounded-full shadow-sm">
                          {data.categories.find(c => c.id === post.categoryId)?.name || '꿀팁'}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-[19px] md:text-lg text-slate-800 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[15px] md:text-sm text-slate-500 line-clamp-2 leading-relaxed">{post.summary}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* RECENT SECTION */}
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                  ✨ 최신 업데이트
                </h2>
                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Recent</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </>
        ) : (
          /* FILTERED FEED */
          <section>
            <div className="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                  {searchQuery ? `'${searchQuery}' 검색 결과` : `${data.categories.find(c => c.id === activeCategory)?.name} 모음`}
                </h2>
                <p className="text-slate-500 font-medium text-[15px] mt-2">총 {filteredPosts.length}개의 가이드가 있습니다.</p>
              </div>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center mx-4">
                <span className="text-6xl block mb-6 drop-shadow-md">🥲</span>
                <h3 className="text-2xl font-black text-slate-700 mb-3">원하시는 결과가 없습니다</h3>
                <p className="text-slate-500 font-medium text-[16px] mb-8 max-w-md px-4 leading-relaxed">다른 검색어를 입력하시거나, 카테고리를 전체로 변경해 보세요.</p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('all');}} 
                  className="bg-blue-600 text-white font-black px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 text-[16px]"
                >
                  전체 목록으로 돌아가기
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
