import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoHelmet from '../components/SeoHelmet';
import AdPlaceholder from '../components/AdPlaceholder';
import { useContent } from '../contexts/ContentContext';

export default function PostDetail() {
  const { slug } = useParams();
  const { data } = useContent();
  const post = data.posts.find(p => p.slug === slug);
  const category = data.categories.find(c => c.id === post?.categoryId);

  if (!post) {
    return (
      <div className="container mx-auto text-center py-32 px-4 min-h-[60vh]">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">해당 글을 찾을 수 없습니다.</h2>
        <Link to="/" className="inline-block bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-900 transition">홈으로 돌아가기</Link>
      </div>
    );
  }

  const { content } = post; // new structured content

  return (
    <article className="bg-white min-h-screen">
      <SeoHelmet 
        title={post.title} 
        description={post.summary} 
        keywords="청소, 생활꿀팁, 세탁, 최저가"
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

        {/* Summary */}
        <div className="bg-slate-50 border-l-4 border-slate-400 p-5 rounded-r-xl mb-10">
          <p className="text-lg text-slate-700 font-medium leading-relaxed">
            {post.summary}
          </p>
        </div>

        {/* 체계적인 본문 시작 */}
        <div className="prose prose-lg prose-slate max-w-none text-slate-800 space-y-12">

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-slate-800 pb-2 mb-4 inline-block">1. 발생 원인 및 문제점</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">🚨 문제 상황</h3>
              <p className="mb-4">{content.problem}</p>
              <h3 className="text-lg font-bold text-slate-800 mb-2">🔍 원인 분석</h3>
              <p>{content.cause}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-slate-800 pb-2 mb-4 inline-block">2. 단계별 해결 방법</h2>
            <div className="space-y-4">
              {Array.isArray(content.solution) ? content.solution.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl">
                  <span className="flex items-center justify-center bg-slate-800 text-white font-black w-8 h-8 rounded-full shrink-0">
                    {idx + 1}
                  </span>
                  <p className="mt-1 font-medium">{step}</p>
                </div>
              )) : (
                <p>{content.solution}</p>
              )}
            </div>
          </section>

          {/* Ad 2: 본문 중간 */}
          <div className="my-8 py-4 border-y border-slate-100">
            <AdPlaceholder position="본문 중간 매치드 콘텐츠 광고" />
          </div>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-slate-800 pb-2 mb-4 inline-block">3. 에디터 추가 꿀팁</h2>
            <p className="bg-yellow-50 text-yellow-900 p-5 rounded-xl border border-yellow-200 font-medium">
              💡 {content.tips}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold border-b-2 border-slate-800 pb-2 mb-4 inline-block">4. 요약 정리</h2>
            <p className="text-lg font-bold text-slate-700 bg-slate-50 p-6 rounded-xl text-center">
              " {content.conclusion} "
            </p>
          </section>

          {/* Recommendation CTA */}
          {content.recommendation && content.recommendation.url && (
            <section className="mt-12 mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center shadow-sm">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">🔥 에디터 추천템</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{content.recommendation.name}</h3>
              <p className="text-slate-500 mb-6 font-medium">역대급 세일 진행 중! 예상 판매가: {content.recommendation.price}</p>
              <a 
                href={content.recommendation.url} 
                target="_blank" 
                rel="noreferrer noopener"
                className="inline-block bg-blue-600 text-white font-black text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-lg w-full md:w-auto"
              >
                👉 최저가 확인하기
              </a>
              <p className="text-xs text-slate-400 mt-4">
                {post.monetization?.affiliate_note || "이 포스팅은 제휴 마케팅이 포함되어 있으며, 이에 따른 일정액의 수수료를 제공받습니다."}
              </p>
            </section>
          )}

        </div>

        {/* Ad 3: 본문 하단 */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <AdPlaceholder position="본문 하단 추천 위젯형 광고" />
        </div>

      </div>
    </article>
  );
}
