import React, { useState, useMemo } from 'react';
import { useContent } from '../contexts/ContentContext';
import ToolCard from '../components/ToolCard';
import SeoHelmet from '../components/SeoHelmet';
import { Calculator, Briefcase, Landmark, Car, PlusCircle } from 'lucide-react';

export default function Home() {
  const { data } = useContent();
  const [activeTab, setActiveTab] = useState('all');

  const filteredTools = useMemo(() => {
    if (activeTab === 'all') return data.tools || [];
    return (data.tools || []).filter(tool => tool.categoryId === activeTab);
  }, [data.tools, activeTab]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="LifeHub 계산기 - 일상에 필요한 모든 계산" 
        description="복잡한 세금, 노후 자금, 자동차 유지비, 생활 속 수학을 단 1초 만에 정확하게 계산해 드립니다."
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 opacity-95 z-0"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] md:text-xs font-black mb-6 tracking-widest border border-emerald-500/30 uppercase">
            LifeHub Calculator Ecosystem
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            어렵고 복잡한 계산,<br/>
            <span className="text-emerald-400 font-extrabold">단 1초</span>면 충분합니다.
          </h1>
          <p className="text-slate-400 text-base md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            매년 바뀌는 세법, 복잡한 노후 자금, 헷갈리는 자동차 취등록세까지.<br className="hidden md:block" />
            정확한 데이터로 당신의 시간과 돈을 아껴드립니다.
          </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
             {data.toolCategories.map(cat => (
               <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${activeTab === cat.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/30' : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'}`}
               >
                 <span className="text-base">{cat.icon}</span> {cat.name}
               </button>
             ))}
             <button 
              onClick={() => setActiveTab('all')}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${activeTab === 'all' ? 'bg-slate-700 border-slate-700 text-white' : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'}`}
             >
               전체보기
             </button>
          </div>
        </div>
      </section>

      {/* 2. CALCULATOR GALLERY SECTION */}
      <main className="container mx-auto max-w-6xl px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
          
          {/* Add Request Placeholder */}
          <div className="bg-slate-50/50 p-8 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-80 h-full min-h-[220px] hover:bg-slate-100 transition-colors cursor-pointer">
             <PlusCircle className="text-slate-400 w-10 h-10 mb-3" />
             <h3 className="font-bold text-slate-600">원하는 계산기가 없나요?</h3>
             <p className="text-[12px] text-slate-400 mt-2 font-medium">필요한 계산기를 요청해주시면<br/>가장 먼저 제작해 드립니다.</p>
          </div>
        </div>

        {filteredTools.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm mt-8">
            <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">이 카테고리의 계산기를 준비 중입니다.</p>
          </div>
        )}
      </main>

      {/* 3. TRUST & FEATURES SECTION */}
      <section className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">LifeHub 계산기를 선택하는 이유</h2>
          <div className="w-12 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">🎯</div>
            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">정확한 값 산출</h4>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">최신 세법과 정책을 반영한 알고리즘으로 단 1원의 오차 없는 정확한 결과값을 제공합니다.</p>
          </div>
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">📊</div>
            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">한눈에 들어오는 시각화</h4>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">딱딱한 숫자 대신 직관적인 그래프와 차트를 통해 복잡한 결과도 누구나 이해하기 쉽게 보여줍니다.</p>
          </div>
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">🔒</div>
            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">철저한 개인정보 보호</h4>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">모든 계산은 사용자의 브라우저에서만 수행되며, 민감한 재산 및 소득 정보는 서버에 절대 저장되지 않습니다.</p>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }
      `}} />
    </div>
  );
}



