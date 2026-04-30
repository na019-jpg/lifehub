import React from 'react';

export default function ProductComparison({ products }) {
  if (!products || !products.budget || !products.premium) return null;

  const { budget, premium } = products;

  return (
    <div className="w-full bg-slate-50/50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm my-12">
      <div className="bg-indigo-600 px-5 py-4 text-center">
        <h3 className="text-white font-black text-lg flex items-center justify-center gap-2">
          <span>🎯</span> 에디터가 엄선한 상황별 추천템
        </h3>
        <p className="text-indigo-200 text-xs mt-1">광고가 아닌 실제 후기와 성분을 분석해 골랐습니다.</p>
      </div>
      
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white">
        
        {/* Budget Product */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between group hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1.5 rounded-lg">
                가성비 1위 🏆
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Sponsored</span>
            </div>
            
            <div className="aspect-square w-3/4 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-40"></div>
              <img src={budget.imageUrl} alt={budget.name} className="relative z-10 w-full h-full object-cover rounded-2xl drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
            </div>

            <h4 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
              {budget.name}
            </h4>
            <p className="text-2xl font-black text-slate-900 mb-6">
              {budget.price}
            </p>
            
            <ul className="space-y-2 mb-8">
              {budget.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                  <span className="text-blue-500 shrink-0 mt-0.5">✔</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          
          <a 
            href={budget.url} 
            target="_blank" 
            rel="noreferrer noopener"
            className="block w-full text-center bg-white border-2 border-blue-600 text-blue-600 font-black py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-300 transform group-hover:-translate-y-1"
          >
            가성비템 보러가기 ➔
          </a>
        </div>

        {/* Premium Product */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between group hover:bg-slate-50 transition-colors relative">
          {/* Subtle highlight for premium */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-full blur-2xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-sm shadow-rose-200 animate-pulse">
                🚨 재고 소진 임박
              </span>
            </div>
            
            <div className="aspect-square w-3/4 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-rose-100 rounded-full blur-2xl opacity-40"></div>
              <img src={premium.imageUrl} alt={premium.name} className="relative z-10 w-full h-full object-cover rounded-2xl drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">
                {premium.name}
              </h4>
              <span className="bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <p className="text-2xl font-black text-rose-600">
                {premium.price}
              </p>
              <p className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                💙 와우회원 한정
              </p>
            </div>
            
            <ul className="space-y-2 mb-8">
              {premium.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 font-bold">
                  <span className="text-rose-500 shrink-0 mt-0.5">✨</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative z-10">
            <a 
              href={premium.url} 
              target="_blank" 
              rel="noreferrer noopener"
              className="block w-full text-center bg-rose-600 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all duration-300 transform group-hover:-translate-y-1 relative overflow-hidden animate-shake"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              확실한 성능템 구매하기 🚀
            </a>
            <p className="text-center text-[10px] text-slate-400 mt-4 px-4">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
