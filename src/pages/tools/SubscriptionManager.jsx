import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';
import ToolTabs from '../../components/ToolTabs';

const SERVICE_DB = [
  { id: 'netflix', name: '넷플릭스', category: 'OTT', price: 17000, color: '#E50914', icon: '🍿' },
  { id: 'youtube', name: '유튜브 프리미엄', category: 'OTT', price: 14900, color: '#FF0000', icon: '📺' },
  { id: 'disney', name: '디즈니+', category: 'OTT', price: 13900, color: '#006E99', icon: '🐭' },
  { id: 'tving', name: '티빙', category: 'OTT', price: 13500, color: '#FF153C', icon: '🎬' },
  { id: 'coupang', name: '쿠팡 와우', category: '커머스', price: 7890, color: '#E67300', icon: '🚀' },
  { id: 'naver', name: '네이버 플러스', category: '커머스', price: 4900, color: '#03C75A', icon: '💚' },
  { id: 'melon', name: '멜론', category: '음악', price: 10900, color: '#00CD3C', icon: '🎵' },
  { id: 'spotify', name: '스포티파이', category: '음악', price: 10900, color: '#1DB954', icon: '🎧' },
];

export default function SubscriptionManager() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isUsd, setIsUsd] = useState(false);
  const [partySize, setPartySize] = useState(1);
  const USD_RATE = 1380;

  const totals = useMemo(() => {
    const rawMonthly = SERVICE_DB
      .filter(s => selectedIds.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
    const monthly = isUsd ? rawMonthly * USD_RATE : rawMonthly;
    const individualMonthly = monthly / partySize;
    return { monthly, yearly: monthly * 12, individualMonthly };
  }, [selectedIds, isUsd, partySize]);

  const toggleService = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const formatValue = (val) => Math.round(val).toLocaleString();

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans">
      <SeoHelmet 
        title="구독 서비스 관리기 | LifeHub Finance" 
        description="넷플릭스, 유튜브 등 숨어있는 구독료를 한눈에 관리하고 아껴보세요."
      />

      <ToolTabs activeCategory="finance" />

      <main className="container mx-auto max-w-2xl px-6 py-12 space-y-8">
        
        {/* Category Info */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            매달 <span className="text-[#1A237E]">숨어있는 구독료</span>를 <br/>정교하게 관리하세요.
          </h2>
          <p className="text-slate-400 text-sm font-medium">아이콘을 탭하여 현재 구독 중인 서비스를 선택하세요.</p>
        </div>

        {/* 1. Visual Tag Grid Card */}
        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Service Library</h3>
           <div className="grid grid-cols-4 gap-4">
              {SERVICE_DB.map(s => (
                <button 
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`flex flex-col items-center gap-3 transition-all duration-300 ${selectedIds.includes(s.id) ? 'scale-105' : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}
                >
                  <div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative"
                    style={{ backgroundColor: s.color + (selectedIds.includes(s.id) ? '' : '15'), color: selectedIds.includes(s.id) ? 'white' : s.color }}
                  >
                    {s.icon}
                    {selectedIds.includes(s.id) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2E7D32] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-black text-center leading-tight ${selectedIds.includes(s.id) ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.name}
                  </span>
                </button>
              ))}
           </div>
        </div>

        {/* 2. Advanced Settings Card */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-8">
           <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900">결제 환경 최적화</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global & Shared Economy</p>
              </div>
              <button 
                onClick={() => setIsUsd(!isUsd)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${isUsd ? 'bg-[#1A237E] border-[#1A237E] text-white shadow-lg shadow-blue-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                {isUsd ? `USD ($) 적용중` : 'KRW (₩)'}
              </button>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Party Size (공유 인원)</span>
                <span className="text-lg font-black text-[#2E7D32]">{partySize}명</span>
              </div>
              <input 
                type="range" min="1" max="4" value={partySize} 
                onChange={e => setPartySize(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]" 
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Single</span>
                <span>Duo</span>
                <span>Trio</span>
                <span>Quad</span>
              </div>
           </div>
        </div>

        {/* 3. Real-time Analysis Report Card */}
        <div className="bg-[#1A237E] rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-white animate-fade-up">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           
           <div className="flex justify-between items-start mb-10">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">Real-time Audit</span>
              {selectedIds.length >= 3 && (
                <span className="bg-[#FFC107] text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg animate-pulse">OTT Diet Required</span>
              )}
           </div>

           <div className="space-y-2 mb-10">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Expected Monthly Expenditure</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{formatValue(totals.individualMonthly)}</span>
                <span className="text-xl font-bold opacity-60">원 / 월</span>
              </div>
              <p className="text-xs font-medium text-white/70">
                {partySize > 1 ? `(원금 ${formatValue(totals.monthly)}원을 ${partySize}명이 분담 시)` : '개인 단독 구독 기준'}
              </p>
           </div>

           <div className="grid grid-cols-2 gap-6 p-6 bg-white/10 rounded-3xl border border-white/10">
              <div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">Annual Total</span>
                <span className="text-xl font-black">{formatValue(totals.yearly)}원</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">Saving Potential</span>
                <span className="text-xl font-black text-[#4CAF50]">{formatValue(totals.yearly * 0.25)}원</span>
              </div>
           </div>
        </div>

        {/* 4. Monetization Strategy Card */}
        <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 space-y-6">
           <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full"></span>
             절약 가이드 & 제휴 혜택
           </h4>
           <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1A237E] transition-all cursor-pointer group">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">💳</div>
                 <div className="flex-1">
                    <div className="text-xs font-black text-slate-900 mb-1">디지털 구독 특화 카드 신청</div>
                    <div className="text-[10px] text-slate-400 font-bold">OTT/쇼핑 멤버십 최대 50% 결제일 할인</div>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                 </svg>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1A237E] transition-all cursor-pointer group">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📱</div>
                 <div className="flex-1">
                    <div className="text-xs font-black text-slate-900 mb-1">통신사 결합 할인 진단</div>
                    <div className="text-[10px] text-slate-400 font-bold">인터넷 + OTT 결합 시 매달 12,000원 추가 절감</div>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                 </svg>
              </div>
           </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
