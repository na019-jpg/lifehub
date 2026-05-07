import React, { useState, useMemo } from 'react';
import { useContent } from '../contexts/ContentContext';
import ToolCard from '../components/ToolCard';
import SeoHelmet from '../components/SeoHelmet';

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
        title="LifeHub Smart Tools - 당신의 일상을 돕는 스마트 도구함" 
        description="복잡한 계산, 이직 시뮬레이션, 육아 발달 상태 등 일상에 꼭 필요한 스마트 도구들을 무료로 이용하세요."
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 py-20 md:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 opacity-95 z-0"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/20 text-blue-300 text-[10px] md:text-xs font-black mb-6 tracking-widest border border-blue-500/30 uppercase">
            LifeHub Utility Ecosystem
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            일상을 <span className="text-blue-400 font-extrabold">데이터</span>로 <br/>
            더 똑똑하게.
          </h1>
          <p className="text-slate-400 text-base md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            찾기 힘든 정책과 복잡한 계산기, 이제 헤매지 마세요. <br className="hidden md:block" />
            LifeHub의 스마트 도구들이 당신의 결정을 가장 빠르고 정확하게 도와드립니다.
          </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-4">
             {data.toolCategories.map(cat => (
               <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${activeTab === cat.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-white/10 border-white/10 text-slate-300 hover:bg-white/20'}`}
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

      {/* 2. TOOL GALLERY SECTION */}
      <main className="container mx-auto max-w-6xl px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
          
          {/* Coming Soon Placeholder */}
          <div className="bg-slate-50/50 p-8 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-60 h-full min-h-[220px]">
             <span className="text-3xl mb-3">⚡</span>
             <h3 className="font-bold text-slate-600">준비 중인 도구</h3>
             <p className="text-[12px] text-slate-400 mt-2 font-medium">직장인, 가계, 육아 관련 <br/>혁신적인 도구들이 업데이트 될 예정입니다.</p>
          </div>
        </div>

        {filteredTools.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm mt-8">
            <span className="text-4xl mb-4 block">🛠️</span>
            <p className="text-slate-400 font-bold">해당 카테고리의 스마트 도구를 곧 만나보실 수 있습니다.</p>
          </div>
        )}
      </main>

      {/* 3. TRUST & FEATURES SECTION */}
      <section className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">왜 LifeHub 유틸리티인가요?</h2>
          <div className="w-12 h-1.5 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">⚡</div>
            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">즉각적인 해결</h4>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">복잡한 약관과 기사를 읽을 필요가 없습니다. 수치만 입력하면 당신이 원하는 정답을 1초 만에 확인하세요.</p>
          </div>
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">🛡️</div>
            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">철저한 데이터 보호</h4>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">입력하신 민감한 개인 정보(급여, 자녀 생일 등)는 서버로 전송되지 않고 고객님의 브라우저 내에서만 안전하게 처리됩니다.</p>
          </div>
          <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">✨</div>
            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">정확한 알고리즘</h4>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">2026년 최신 근로기준법 및 정부 주거 지원 정책 가이드라인을 완벽하게 학습한 알고리즘이 정확한 결과를 제공합니다.</p>
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


