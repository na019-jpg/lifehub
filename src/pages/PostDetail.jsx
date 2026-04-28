import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoHelmet from '../components/SeoHelmet';
import AdPlaceholder from '../components/AdPlaceholder';
import { useContent } from '../contexts/ContentContext';

export default function PostDetail() {
  const { slug } = useParams();
  const { data } = useContent();
  const post = data.posts.find(p => p.slug === slug);
  const category = data.categories.find(c => c.id === post?.categoryId);

  // 1. Scroll Progress State
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight === 0) return;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(scroll * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Share Handler
  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      text: post?.summary,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다! 친구들에게 공유해보세요.');
    }
  };

  // 3. Related Posts
  const relatedPosts = data.posts
    .filter(p => p.categoryId === post?.categoryId && p.id !== post?.id)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="container mx-auto text-center py-32 px-4 min-h-[60vh]">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">해당 글을 찾을 수 없습니다.</h2>
        <Link to="/" className="inline-block bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-900 transition">홈으로 돌아가기</Link>
      </div>
    );
  }

  const { content } = post; // new structured content

  // Generate JSON-LD Schema
  const schemaObj = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "image": post.thumbnailUrl ? [post.thumbnailUrl] : [],
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Person",
        "name": "Editor"
      },
      "description": post.summary
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": post.title,
      "description": post.summary,
      "step": Array.isArray(content.solution) 
        ? content.solution.map((stepText) => ({
            "@type": "HowToStep",
            "text": stepText
          }))
        : [{
            "@type": "HowToStep",
            "text": content.solution
          }]
    }
  ];

  return (
    <article className="bg-white min-h-screen relative">
      {/* 1. Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1.5 bg-indigo-600 z-[100] transition-all duration-150 ease-out" 
        style={{ width: `${scrollProgress}%` }}
      ></div>
      <SeoHelmet 
        title={post.title} 
        description={post.summary} 
        keywords="청소, 생활꿀팁, 세탁, 최저가"
        schema={schemaObj}
      />

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-6">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <span>›</span>
          <span className="text-slate-800">{category?.name}</span>
        </nav>

        {/* Article Header (h1) */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-slate-500 border-b border-slate-200 pb-4">
            <span>By Editor | {post.date}</span>
          </div>
        </header>

        {/* Ad 1: 제목 아래 */}
        <div className="my-6">
          <AdPlaceholder position="상단 스폰서 텍스트 광고" />
        </div>

        {/* Thumbnail */}
        {post.thumbnailUrl && (
          <figure className="mb-10 w-full aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden">
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
          </figure>
        )}

        {/* AI Summary Box (AEO Optimization) */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-12 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <span className="text-2xl">💡</span>
            <h2 id="ai-summary" className="text-xl md:text-2xl font-black text-indigo-900">AI 핵심 요약 (Quick Answer)</h2>
          </div>
          <p className="text-slate-700 font-medium mb-4 relative z-10">
            {post.summary}
          </p>
          <ul className="space-y-3 relative z-10 bg-white/60 p-5 rounded-xl border border-white/80">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold shrink-0">🎯 문제/원인:</span>
              <span className="text-slate-800 leading-relaxed line-clamp-2">{content.cause || content.problem}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold shrink-0">🚀 핵심 해결책:</span>
              <span className="text-slate-800 leading-relaxed line-clamp-2">{Array.isArray(content.solution) ? content.solution[0] : content.solution}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold shrink-0">✨ 기대 효과:</span>
              <span className="text-slate-800 leading-relaxed line-clamp-2">{content.conclusion}</span>
            </li>
          </ul>
        </div>

        {/* 체계적인 본문 시작 */}
        <div className="prose prose-base md:prose-lg prose-slate max-w-none text-slate-800 prose-p:text-[16px] prose-p:leading-[1.7] md:prose-p:text-[18px] md:prose-p:leading-[1.8] space-y-16 md:space-y-20">

          {/* 1. 발생 원인 및 문제점 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center bg-indigo-600 text-white w-8 h-8 rounded-lg font-black shrink-0 shadow-md">1</span>
              <h2 className="text-2xl font-extrabold text-slate-900 m-0">발생 원인 및 문제점</h2>
            </div>
            <div className="bg-white border border-slate-100 shadow-lg shadow-slate-200/40 rounded-2xl p-6 md:p-8 transition hover:shadow-xl">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2 mb-3">
                <span>🚨</span> 문제 상황
              </h3>
              <p className="mb-6 text-slate-600 leading-relaxed">{content.problem}</p>
              
              <h3 className="text-lg font-bold text-indigo-600 flex items-center gap-2 mb-3">
                <span>🔍</span> 원인 분석
              </h3>
              <p className="text-slate-600 leading-relaxed">{content.cause}</p>
            </div>
          </section>

          {/* 2. 단계별 해결 방법 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center bg-indigo-600 text-white w-8 h-8 rounded-lg font-black shrink-0 shadow-md">2</span>
              <h2 className="text-2xl font-extrabold text-slate-900 m-0">단계별 해결 방법</h2>
            </div>
            <div className="space-y-4">
              {Array.isArray(content.solution) ? content.solution.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white border border-slate-100 shadow-md shadow-slate-200/30 p-5 rounded-2xl hover:-translate-y-1 transition transform duration-300">
                  <span className="flex items-center justify-center bg-slate-100 text-indigo-600 font-extrabold w-10 h-10 rounded-full shrink-0 text-lg">
                    {idx + 1}
                  </span>
                  <p className="mt-1 md:mt-2 font-medium text-slate-700 leading-relaxed">{step}</p>
                </div>
              )) : (
                <p className="bg-white p-6 rounded-2xl shadow-md">{content.solution}</p>
              )}
            </div>
          </section>

          {/* 2. 맥락형 미니 쿠팡 배너 (해결 방법 직후 삽입) */}
          {content.recommendation && content.recommendation.url && (
            <div className="my-8 bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <p className="text-xs font-bold text-indigo-600 mb-0.5">에디터가 직접 효과 본 해결템</p>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{content.recommendation.name}</p>
                </div>
              </div>
              <a href={content.recommendation.url} target="_blank" rel="noreferrer noopener" className="w-full sm:w-auto text-center bg-indigo-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm shrink-0">
                로켓배송 보러가기 ➔
              </a>
            </div>
          )}

          {/* Ad 2: 본문 중간 */}
          <div className="my-10 py-6 border-y border-slate-100 flex justify-center">
            <AdPlaceholder position="본문 중간 매치드 콘텐츠 광고" />
          </div>

          {/* 3. 에디터 추가 꿀팁 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center bg-indigo-600 text-white w-8 h-8 rounded-lg font-black shrink-0 shadow-md">3</span>
              <h2 className="text-2xl font-extrabold text-slate-900 m-0">에디터 추가 꿀팁</h2>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 md:p-8 rounded-2xl border border-yellow-200/50 shadow-md">
              <div className="flex gap-4 items-start">
                <span className="text-3xl">💡</span>
                <p className="font-semibold text-slate-800 leading-loose">
                  {content.tips}
                </p>
              </div>
            </div>
          </section>

          {/* 4. 요약 정리 */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center bg-indigo-600 text-white w-8 h-8 rounded-lg font-black shrink-0 shadow-md">4</span>
              <h2 className="text-2xl font-extrabold text-slate-900 m-0">요약 정리</h2>
            </div>
            <p className="text-xl font-bold text-slate-800 bg-slate-100/80 p-8 rounded-3xl text-center shadow-inner leading-loose">
              " {content.conclusion} "
            </p>
          </section>

          {/* Recommendation CTA */}
          {content.recommendation && content.recommendation.url && (
            <section className="mt-16 mb-8 relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-10 text-center shadow-2xl shadow-indigo-200/50">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              
              <span className="relative z-10 inline-block bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold px-4 py-1.5 rounded-full mb-4 text-sm tracking-wide">
                🔥 에디터 추천 최저가 아이템
              </span>
              
              <h3 className="relative z-10 text-2xl md:text-3xl font-black text-white mb-3 drop-shadow-md">
                {content.recommendation.name}
              </h3>
              
              <p className="relative z-10 text-indigo-100 mb-8 font-medium text-lg">
                역대급 할인 적용가: <strong className="text-yellow-300 text-2xl">{content.recommendation.price}</strong>
              </p>
              
              <a 
                href={content.recommendation.url} 
                target="_blank" 
                rel="noreferrer noopener"
                className="relative z-10 inline-flex items-center justify-center bg-white text-indigo-600 font-black text-lg px-8 py-4 rounded-xl hover:bg-slate-50 transition transform hover:-translate-y-1 shadow-lg w-full md:w-auto overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                👉 자세히 알아보기
              </a>
              
              <p className="relative z-10 text-xs text-white/60 mt-6 pt-4 border-t border-white/20">
                {post.monetization?.affiliate_note || "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."}
              </p>
            </section>
          )}

        </div>

        {/* Ad 3: 본문 하단 */}
        <div className="mt-16 border-t border-slate-200 pt-10 flex justify-center">
          <AdPlaceholder position="본문 하단 추천 위젯형 광고" />
        </div>

        {/* 4. 공유하기 버튼 */}
        <div className="mt-12 flex justify-center">
          <button onClick={handleShare} className="flex items-center gap-2 bg-[#FEE500] hover:bg-[#F4DC00] text-slate-900 font-black px-8 py-4 rounded-2xl shadow-lg shadow-yellow-200/50 transition transform hover:-translate-y-1 w-full md:w-auto justify-center">
            <span className="text-xl">💬</span>
            카카오톡 등 유용한 꿀팁 공유하기
          </button>
        </div>

        {/* 3. 다음 꿀팁 이어보기 (Related Posts) */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-12 pb-24 md:pb-8">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><span>✨</span> 이런 생활 꿀팁은 어떠세요?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rp => (
                <Link key={rp.id} to={`/post/${rp.slug}`} onClick={() => window.scrollTo(0,0)} className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  {rp.thumbnailUrl ? (
                    <div className="w-full aspect-[4/3] overflow-hidden">
                      <img src={rp.thumbnailUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ) : (
                    <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center text-slate-300">No Image</div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition leading-snug">{rp.title}</h4>
                    <div className="text-xs text-slate-400 mt-2 font-bold">{rp.date}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Sticky Bottom CTA for Mobile & Desktop */}
      {content.recommendation && content.recommendation.url && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 transform transition-transform duration-300">
          <div className="container mx-auto max-w-3xl flex items-center justify-between gap-4">
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-xs text-indigo-600 font-bold mb-0.5">🔥 지금 할인 중</p>
              <p className="text-sm font-bold text-slate-900 truncate">{content.recommendation.name}</p>
            </div>
            <a 
              href={content.recommendation.url} 
              target="_blank" 
              rel="noreferrer noopener"
              className="flex-1 md:flex-none text-center bg-indigo-600 text-white font-black text-[17px] md:text-lg px-6 py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 animate-[pulse_2s_infinite]"
            >
              🚀 최저가 확인하기
            </a>
          </div>
        </div>
      )}

    </article>
  );
}
