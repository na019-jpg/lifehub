import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import PostCard from '../components/PostCard';
import SeoHelmet from '../components/SeoHelmet';

export default function Home() {
  const { data } = useContent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Bottom Sheet state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle active category change, resetting subcategory
  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setActiveSubcategory('all');
  };

  // Find subcategories for the currently selected category
  const currentCategoryObj = useMemo(() => {
    return data.categories.find(c => c.id === activeCategory);
  }, [activeCategory, data.categories]);

  const filteredPosts = useMemo(() => {
    return data.posts.filter(post => {
      // 1. 카테고리 필터
      const matchCategory = activeCategory === 'all' || post.categoryId === activeCategory;
      // 2. 서브카테고리 필터
      const matchSubcategory = activeSubcategory === 'all' || post.subcategory === activeSubcategory;
      
      // 3. 검색어 필터
      const query = searchQuery.toLowerCase();
      const matchSearch = !query || 
                          post.title.toLowerCase().includes(query) || 
                          post.summary.toLowerCase().includes(query) ||
                          (post.tags && post.tags.toLowerCase().includes(query));
                          
      return matchCategory && matchSubcategory && matchSearch;
    });
  }, [data.posts, activeCategory, activeSubcategory, searchQuery]);

  // Featured Posts for the top carousel (only show when no filters are active)
  const isFiltering = activeCategory !== 'all' || activeSubcategory !== 'all' || searchQuery !== '';
  const featuredPosts = useMemo(() => data.posts.slice(0, 3), [data.posts]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="LifeHub - 프리미엄 생활 매거진" 
        description="일상 속 모든 문제를 해결하는 오직 당신을 위한 프리미엄 가이드. 청소, 정리, 요리 꿀팁!"
      />
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative px-4 py-16 md:py-24 overflow-hidden bg-slate-900 text-white">
        {/* Background Decorative Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 opacity-90 z-0"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-200 text-sm font-bold mb-6 tracking-widest border border-blue-500/30">
            PREMIUM 커뮤니티 꿀팁 사전
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
            오늘의 삶을 <span className="text-blue-400">10%</span> 더 쾌적하게.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
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
              className="w-full pl-14 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/20 focus:bg-white focus:text-slate-900 focus:border-blue-400 rounded-full outline-none transition-all font-bold text-white placeholder-slate-300 shadow-xl"
            />
            {/* Direct Filter Open Button integrated inside search bar for desktop */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="absolute inset-y-2 right-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 rounded-full text-sm transition-colors flex items-center gap-1 shadow-md"
            >
              <span>⚙️</span> 필터링
            </button>
          </div>
        </div>
      </section>

      {/* 2. TRENDING / FEATURED SECTION (Hidden when searching/filtering) */}
      {!isFiltering && featuredPosts.length > 0 && (
        <section className="container mx-auto max-w-5xl px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="text-red-500">🔥</span> 에디터 추천 BEST
            </h2>
          </div>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0">
            {featuredPosts.map((post) => (
              <div key={post.id} className="min-w-[280px] sm:min-w-0 bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 group hover:shadow-xl transition-all duration-300 flex-shrink-0 cursor-pointer">
                <Link to={`/post/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.thumbnailUrl || 'https://via.placeholder.com/800x600?text=No+Image'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                      {data.categories.find(c => c.id === post.categoryId)?.name || '꿀팁'}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{post.summary}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. MAIN FEED SECTION */}
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {searchQuery ? `'${searchQuery}' 검색 결과` : 
               activeCategory === 'all' ? '전체 라이프스타일 매거진' : 
               activeSubcategory === 'all' ? `${currentCategoryObj?.name} 모음` :
               `${activeSubcategory} 포스팅`
              }
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-1">총 {filteredPosts.length}개의 가이드가 있습니다.</p>
          </div>
          
          {/* Mobile Filter Toggle Button (Shown when sticky or regular layout) */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold shadow-sm hover:bg-slate-700 transition"
          >
            <span>⚙️</span>
            {activeCategory !== 'all' ? '필터 재설정' : '상세 필터'}
          </button>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <span className="text-6xl block mb-6 drop-shadow-md">🥲</span>
            <h3 className="text-2xl font-black text-slate-700 mb-3">원하시는 결과가 없습니다</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-md">검색어를 짧게 줄여보시거나, 필터 설정을 초기화하여 모든 에디터의 글을 확인해 보세요.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('all'); setActiveSubcategory('all');}} 
              className="bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              전체 목록으로 돌아가기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} categoryName={data.categories.find(c => c.id === post.categoryId)?.name} />
            ))}
          </div>
        )}
      </main>

      {/* =========================================
          4. FILTER MODAL / BOTTOM SHEET DIALOG
      ============================================ */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          
          {/* Background click to close */}
          <div className="absolute inset-0" onClick={() => setIsFilterOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in max-h-[85vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800">🔍 맞춤 필터 설정</h3>
              <button onClick={() => setIsFilterOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                X
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto w-full">
              <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">메인 카테고리 (대분류)</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all border ${
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
                    className={`px-4 py-2 rounded-xl font-bold transition-all border flex items-center gap-1.5 ${
                      activeCategory === c.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.icon}</span> {c.name}
                  </button>
                ))}
              </div>

              {activeCategory !== 'all' && currentCategoryObj && currentCategoryObj.subcategories?.length > 0 && (
                <div className="animate-fade-in">
                  <h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">상세 분야 (소분류)</h4>
                  <select
                    value={activeSubcategory}
                    onChange={(e) => setActiveSubcategory(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 font-bold text-base outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">💠 전체 ({currentCategoryObj.name})</option>
                    {currentCategoryObj.subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-2 ml-1">상세 분야를 선택하시면 원하시는 꿀팁만 정확히 추려냅니다.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSubcategory('all');
                  setSearchQuery('');
                }}
                className="px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 transition-colors"
              >
                초기화
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-blue-600 text-white font-black px-6 py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition"
              >
                {filteredPosts.length}건 결과 보기
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Mini custom styles for modal animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}} />
    </div>
  );
}
