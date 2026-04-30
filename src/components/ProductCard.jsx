import React from 'react';

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group my-12">
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center justify-between">
        <span className="text-xs font-black text-indigo-600 tracking-wider">🔥 에디터 추천 해결템</span>
        <span className="text-[10px] text-slate-400 font-medium">Sponsored</span>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-[40%] relative bg-slate-50 flex items-center justify-center p-8 md:border-r border-slate-100 shrink-0 overflow-hidden">
          {/* subtle background blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="relative z-10 w-full h-auto max-w-[220px] aspect-square object-cover rounded-xl drop-shadow-xl group-hover:scale-105 transition-transform duration-500" 
          />
        </div>
        
        {/* Content Section */}
        <div className="md:w-[60%] p-6 md:p-8 flex flex-col justify-between bg-white">
          <div>
            <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-2xl font-black text-red-500 mb-6 tracking-tight">
              {product.price}
            </p>
            
            <div className="bg-indigo-50/40 rounded-xl p-5 border border-indigo-100/50 mb-8 shadow-inner">
              <p className="text-xs font-black text-indigo-700 mb-3 flex items-center gap-1.5">
                <span className="text-lg">✨</span> AI 요약 3줄 장점 포인트
              </p>
              <ul className="space-y-2.5">
                {product.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed font-semibold">
                    <span className="text-indigo-500 shrink-0 mt-0.5">✔</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div>
            <a 
              href={product.url} 
              target="_blank" 
              rel="noreferrer noopener"
              className="block w-full text-center bg-indigo-600 text-white font-black py-4 px-6 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              쿠팡 최저가로 구매하기 🚀
            </a>
            <p className="text-center text-[10px] text-slate-400 mt-4 px-4 leading-relaxed">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
