import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoHelmet from '../components/SeoHelmet';
import AdPlaceholder from '../components/AdPlaceholder';
import ProductCard from '../components/ProductCard';
import PostCard from '../components/PostCard';
import { affiliateProducts } from '../data/affiliateProducts';
import { useContent } from '../contexts/ContentContext';

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
          const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          if (windowHeight > 0) {
            setScrollProgress((totalScroll / windowHeight) * 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-1.5 bg-indigo-600 z-[100] transition-all duration-150 ease-out" 
      style={{ width: `${scrollProgress}%` }}
    ></div>
  );
};

export default function PostDetail() {
  const { slug } = useParams();
  const { data } = useContent();
  const post = data.posts.find(p => p.slug === slug || p.id === slug);
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

  // 3. Related Posts (exactly 3)
  let relatedPosts = data.posts
    .filter(p => p.categoryId === post?.categoryId && p.id !== post?.id)
    .slice(0, 3);

  // 같은 카테고리에 다른 글이 아직 없다면, 카테고리 상관없이 최신 글을 추천합니다.
  if (relatedPosts.length < 3) {
    const additionalPosts = data.posts
      .filter(p => p.id !== post?.id && !relatedPosts.some(rp => rp.id === p.id))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts = [...relatedPosts, ...additionalPosts];
  }

  if (!post) {
    return (
      <div className="container mx-auto text-center py-32 px-4 min-h-[60vh]">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">해당 글을 찾을 수 없습니다.</h2>
        <Link to="/" className="inline-block bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-900 transition">홈으로 돌아가기</Link>
      </div>
    );
  }

  const { content } = post; // new structured content

  // 5. Keyword Matching Logic for ProductCard
  let matchedProduct = null;
  const searchString = `${post.title} ${post.tags || ''} ${post.summary}`.toLowerCase();
  
  for (const [key, product] of Object.entries(affiliateProducts)) {
    if (searchString.includes(key)) {
      matchedProduct = product;
      break; 
    }
  }

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
        "name": "LifeHub Editor"
      },
      "publisher": {
        "@type": "Organization",
        "name": "LifeHub",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lifestyle-hub.co.kr/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "description": post.summary
    }
  ];

  // 6. Generate FAQ Schema (AEO Optimization)
  if (content.faqs && content.faqs.length > 0) {
    schemaObj.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": content.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    });
  }

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
        url={window.location.href}
        type="article"
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

        {/* AI Summary Box */}
        <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl mb-12 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-5 relative z-10 border-b border-slate-200 pb-3">
            <span className="text-2xl">💡</span>
            <h2 id="ai-summary" className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">AI 핵심 요약 (Quick Answer)</h2>
          </div>
          <p className="text-slate-800 font-medium mb-6 relative z-10 text-[16px] md:text-[18px] leading-relaxed">
            {post.summary}
          </p>
          <ul className="space-y-4 relative z-10 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <li className="flex items-start gap-3">
              <span className="text-red-500 font-black shrink-0 bg-red-50 px-2 py-0.5 rounded text-sm mt-0.5">원인</span>
              <span className="text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: content.cause || content.problem }} />
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-600 font-black shrink-0 bg-indigo-50 px-2 py-0.5 rounded text-sm mt-0.5">해결</span>
              <span className="text-slate-800 leading-relaxed font-bold" dangerouslySetInnerHTML={{ __html: Array.isArray(content.solution) ? content.solution[0] : content.solution }} />
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-black shrink-0 bg-green-50 px-2 py-0.5 rounded text-sm mt-0.5">효과</span>
              <span className="text-slate-700 leading-relaxed font-medium">{content.conclusion}</span>
            </li>
          </ul>
        </div>

        <div className="my-10">
          <AdPlaceholder position="본문 상단 광고" />
        </div>

        <div className="prose prose-base md:prose-lg prose-slate max-w-none text-[#222222] prose-p:text-[17px] prose-p:leading-[2.0] md:prose-p:text-[19px] md:prose-p:leading-[2.2] space-y-20 md:space-y-24 tracking-[-0.02em]">

          {/* 1. 발생 원인 및 문제점 */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-l-8 border-indigo-600 pl-4 mb-8">
              발생 원인 및 문제점
            </h2>
            <div className="px-2 md:px-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 mt-6">
                <span className="text-red-500">Q.</span> 이런 문제, 왜 생길까요?
              </h3>
              <p className="mb-8 bg-red-50/50 p-6 rounded-xl border border-red-100" dangerouslySetInnerHTML={{ __html: content.problem }} />
              
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 mt-6">
                <span className="text-indigo-600">A.</span> 정확한 원인은 이렇습니다.
              </h3>
              <p className="bg-indigo-50/30 p-6 rounded-xl border border-indigo-50" dangerouslySetInnerHTML={{ __html: content.cause }} />
            </div>
          </section>

          {/* 2. 단계별 해결 방법 */}
          <section className="scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 border-l-8 border-indigo-600 pl-4 mb-8">
              실전! 단계별 해결 방법
            </h2>
            <div className="space-y-6 px-2 md:px-4">
              {Array.isArray(content.solution) ? content.solution.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex gap-4 items-start bg-white border border-slate-200 shadow-sm p-6 md:p-8 rounded-2xl hover:border-indigo-300 transition-colors">
                    <span className="flex items-center justify-center bg-indigo-600 text-white font-extrabold w-10 h-10 rounded-full shrink-0 text-lg shadow-sm mt-1">
                      {idx + 1}
                    </span>
                    <div className="font-medium text-slate-800 leading-[1.9] w-full text-[17px] md:text-[19px]" dangerouslySetInnerHTML={{ __html: step }} />
</div>
{idx === 0 && matchedProduct && (<div className="my-10 animate-fade-in"><ProductCard product={matchedProduct} /></div>)}
</React.Fragment>
              )) : (
                <>
<div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 w-full font-medium leading-[1.9] text-[17px] md:text-[19px]" dangerouslySetInnerHTML={{ __html: content.solution }} />
{matchedProduct && (
<div className="my-10 animate-fade-in">
<ProductCard product={matchedProduct} />
</div>
)}
</>
              )}
            </div>
          </section>

          <div className="my-14 flex justify-center">
            <AdPlaceholder position="본문 중간 콘텐츠 광고" />
          </div>

          <section className="scroll-mt-24 px-2 md:px-4">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-yellow-500">💡</span> 에디터가 알려주는 숨은 꿀팁
            </h2>
            <div className="bg-yellow-50/80 p-8 rounded-3xl border border-yellow-200/60 shadow-sm relative">
              <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-yellow-200 text-xs font-bold text-yellow-600 shadow-sm">Bonus Tip</div>
              <div className="font-semibold text-slate-800 leading-[2.0] text-[17px]" dangerouslySetInnerHTML={{ __html: content.tips }} />
            </div>
          </section>

          <section className="scroll-mt-24 px-2 md:px-4 mb-16">
            <blockquote className="border-l-4 border-slate-800 bg-slate-50 p-8 rounded-r-3xl text-slate-700 italic font-medium leading-relaxed">
              <span className="block text-4xl text-slate-300 mb-2 font-serif">"</span>
              <p className="text-[19px] md:text-[21px] font-bold text-slate-900 mb-4">{content.conclusion}</p>
              <span className="block text-right text-4xl text-slate-300 font-serif">"</span>
            </blockquote>
          </section>

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

        <div className="mt-16 border-t border-slate-200 pt-10 flex justify-center">
          <AdPlaceholder position="본문 하단 추천 위젯형 광고" />
        </div>

        <div className="mt-12 flex justify-center">
          <button onClick={handleShare} className="flex items-center gap-2 bg-[#FEE500] hover:bg-[#F4DC00] text-slate-900 font-black px-8 py-4 rounded-2xl shadow-lg shadow-yellow-200/50 transition transform hover:-translate-y-1 w-full md:w-auto justify-center">
            <span className="text-xl">💬</span>
            카카오톡 등 유용한 꿀팁 공유하기
          </button>
        </div>

        {/* 5. FAQ Section (AEO Optimization) */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="mt-20 border-t border-slate-200 pt-12 animate-fade-in">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2"><span>🙋‍♂️</span> 궁금해하실 내용을 정리했어요</h3>
            <div className="space-y-4">
              {content.faqs.map((faq, idx) => (
                <div key={idx} className="bg-emerald-50/30 rounded-3xl p-6 md:p-8 border border-emerald-100/50 hover:border-emerald-300 transition-all group">
                  <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-4 flex items-start gap-3">
                    <span className="bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-sm shadow-emerald-200">Q</span>
                    {faq.q}
                  </h4>
                  <div className="text-slate-700 leading-relaxed pl-10 border-l-2 border-emerald-200/50 ml-3.5 font-medium md:text-[17px]">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Category Explorer (Jump to other categories) */}
        <section className="mt-20 border-t border-slate-200 pt-12">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><span>📂</span> 다른 주제의 꿀팁도 확인해보세요</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.categories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/?cat=${cat.id}`} 
                className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-300 hover:shadow-md transition group text-center"
              >
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 7. Enhanced Recommended Content (3 Items) */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-12 pb-24 md:pb-8">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2"><span>✨</span> 에디터 추천 콘텐츠</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rp => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Sticky Bottom CTA */}
      {content.recommendation && content.recommendation.url && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 transform transition-transform duration-300">
          <div className="container mx-auto max-w-3xl flex items-center justify-between gap-4">
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-xs text-rose-600 font-bold mb-0.5 animate-pulse">🚨 재고 소진 임박 / 와우회원 특가</p>
              <p className="text-sm font-bold text-slate-900 truncate">{content.recommendation.name}</p>
            </div>
            <a 
              href={content.recommendation.url} 
              target="_blank" 
              rel="noreferrer noopener"
              className="flex-1 md:flex-none text-center bg-rose-600 text-white font-black text-[17px] md:text-lg px-6 py-4 rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-200 animate-shake overflow-hidden relative group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              🚀 최저가 확인하기
            </a>
          </div>
        </div>
      )}

    </article>
  );
}

