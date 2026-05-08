import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';
import ToolTabs from '../../components/ToolTabs';

const SERVICE_DB = [
  { 
    id: 'netflix', name: '넷플릭스', category: 'OTT', color: '#E50914', icon: '🍿', 
    plans: [ 
      { id: 'ad', name: '광고형 스탠다드', price: 5500 }, 
      { id: 'standard', name: '스탠다드', price: 13500 }, 
      { id: 'premium', name: '프리미엄', price: 17000 } 
    ] 
  },
  { 
    id: 'youtube', name: '유튜브 프리미엄', category: 'OTT', color: '#FF0000', icon: '📺', 
    plans: [ { id: 'premium', name: '프리미엄', price: 14900 } ] 
  },
  { 
    id: 'disney', name: '디즈니+', category: 'OTT', color: '#006E99', icon: '🐭', 
    plans: [ 
      { id: 'standard', name: '스탠다드', price: 9900 }, 
      { id: 'premium', name: '프리미엄', price: 13900 } 
    ] 
  },
  { 
    id: 'tving', name: '티빙', category: 'OTT', color: '#FF153C', icon: '🎬', 
    plans: [ 
      { id: 'basic', name: '베이직', price: 9500 }, 
      { id: 'standard', name: '스탠다드', price: 13500 }, 
      { id: 'premium', name: '프리미엄', price: 17000 } 
    ] 
  },
  { 
    id: 'coupang', name: '쿠팡 와우', category: '커머스', color: '#E67300', icon: '🚀', 
    plans: [ { id: 'wow', name: '와우 멤버십', price: 7890 } ] 
  },
  { 
    id: 'naver', name: '네이버 플러스', category: '커머스', color: '#03C75A', icon: '💚', 
    plans: [ { id: 'plus', name: '플러스 멤버십', price: 4900 } ] 
  },
  { 
    id: 'melon', name: '멜론', category: '음악', color: '#00CD3C', icon: '🎵', 
    plans: [ 
      { id: 'streaming', name: '스트리밍', price: 7900 }, 
      { id: 'offline', name: '스트리밍+오프라인', price: 10900 } 
    ] 
  },
  { 
    id: 'spotify', name: '스포티파이', category: '음악', color: '#1DB954', icon: '🎧', 
    plans: [ 
      { id: 'individual', name: '개인', price: 10900 }, 
      { id: 'duo', name: '듀오', price: 16350 } 
    ] 
  },
];

export default function SubscriptionManager() {
  const [selectedServices, setSelectedServices] = useState({});
  const [contribution, setContribution] = useState({ type: 'n-divide', value: 1 });
  const [isUsd, setIsUsd] = useState(false);
  const USD_RATE = 1380;

  const toggleService = (id) => {
    setSelectedServices(prev => {
      const newMap = { ...prev };
      if (newMap[id]) {
        delete newMap[id];
      } else {
        const svc = SERVICE_DB.find(s => s.id === id);
        newMap[id] = { 
          planId: svc.plans[svc.plans.length - 1].id, 
          billing: 'monthly', 
          discount: '0' 
        };
      }
      return newMap;
    });
  };

  const updateServiceConfig = (id, field, value) => {
    setSelectedServices(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleContributionChange = (field, value) => {
    setContribution(prev => ({ ...prev, [field]: value }));
  };

  const totals = useMemo(() => {
    let totalMonthly = 0;
    let totalYearly = 0;

    Object.entries(selectedServices).forEach(([svcId, config]) => {
      const svc = SERVICE_DB.find(s => s.id === svcId);
      if (!svc) return;
      const plan = svc.plans.find(p => p.id === config.planId) || svc.plans[0];
      let price = plan.price;
      
      if (config.discount === '10') price *= 0.9;
      if (config.discount === '20') price *= 0.8;
      if (config.discount === '30') price *= 0.7;

      let monthly = price;
      let yearly = price * 12;

      if (config.billing === 'yearly') {
        monthly = price * 0.9;
        yearly = price * 10.8;
      }

      totalMonthly += monthly;
      totalYearly += yearly;
    });

    if (isUsd) {
      totalMonthly *= USD_RATE;
      totalYearly *= USD_RATE;
    }

    let myMonthly = 0;
    let myYearly = 0;

    if (contribution.type === 'n-divide') {
      myMonthly = totalMonthly / contribution.value;
      myYearly = totalYearly / contribution.value;
    } else if (contribution.type === 'percent') {
      myMonthly = totalMonthly * (contribution.value / 100);
      myYearly = totalYearly * (contribution.value / 100);
    } else if (contribution.type === 'fixed') {
      myMonthly = Math.min(contribution.value, totalMonthly);
      myYearly = Math.min(contribution.value * 12, totalYearly);
    }

    return { 
      totalMonthly, totalYearly, 
      myMonthly, myYearly,
      my5Year: myYearly * 5,
      my10Year: myYearly * 10
    };
  }, [selectedServices, isUsd, contribution]);

  const formatValue = (val) => Math.round(val).toLocaleString();

  const getOpportunityCost = (amount) => {
    if (amount >= 30000000) return '🚗 중형 세단 한 대를 살 수 있는 엄청난 금액입니다.';
    if (amount >= 10000000) return '✈️ 유럽 한 달 살기 여행을 여유롭게 다녀올 수 있습니다.';
    if (amount >= 5000000) return '👜 프리미엄 명품 백을 하나 살 수 있는 금액입니다.';
    if (amount >= 2000000) return '💻 최고급 사양의 전문가용 노트북을 구매할 수 있습니다.';
    if (amount >= 1000000) return '📱 최신 플래그십 스마트폰 자급제 기기를 살 수 있습니다.';
    if (amount >= 500000) return '🏨 5성급 호텔에서 호캉스 1박 2일을 즐길 수 있습니다.';
    if (amount >= 100000) return '🥩 최고급 한우 오마카세 2인 식사가 가능한 금액입니다.';
    return '☕ 매일 커피 한 잔의 여유를 가질 수 있습니다.';
  };

  const selectedKeys = Object.keys(selectedServices);

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans">
      <SeoHelmet 
        title="구독 서비스 관리기 | LifeHub Finance" 
        description="넷플릭스, 유튜브 등 숨어있는 구독료를 정교하게 관리하고 10년 뒤의 누적 비용을 확인하세요."
      />

      <ToolTabs activeCategory="finance" />

      <main className="container mx-auto max-w-2xl px-6 py-12 space-y-8">
        
        {/* Category Info */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            매달 <span className="text-[#1A237E]">숨어있는 구독료</span>를 <br/>정교하게 관리하세요.
          </h2>
          <p className="text-slate-400 text-sm font-medium">서비스를 선택하고, 나의 실제 분담금을 설정해보세요.</p>
        </div>

        {/* 1. Visual Tag Grid Card */}
        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Service Library</h3>
           <div className="grid grid-cols-4 gap-4">
              {SERVICE_DB.map(s => {
                const isSelected = !!selectedServices[s.id];
                return (
                  <button 
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`flex flex-col items-center gap-3 transition-all duration-300 ${isSelected ? 'scale-105' : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}
                  >
                    <div 
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative"
                      style={{ backgroundColor: s.color + (isSelected ? '' : '15'), color: isSelected ? 'white' : s.color }}
                    >
                      {s.icon}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2E7D32] rounded-full flex items-center justify-center border-2 border-white shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-black text-center leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
           </div>
        </div>

        {/* 2. Selected Services Configurator */}
        {selectedKeys.length > 0 && (
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-6 animate-fade-up">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#1A237E] rounded-full"></span>
              선택한 서비스 요금 설정
            </h3>
            
            <div className="space-y-4">
              {selectedKeys.map(id => {
                const svc = SERVICE_DB.find(s => s.id === id);
                const config = selectedServices[id];
                return (
                  <div key={id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <span className="text-xl">{svc.icon}</span>
                      <span className="text-sm font-black text-slate-800">{svc.name}</span>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                      {/* Plan Dropdown */}
                      <select 
                        value={config.planId}
                        onChange={(e) => updateServiceConfig(id, 'planId', e.target.value)}
                        className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-[#1A237E] w-full"
                      >
                        {svc.plans.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({formatValue(p.price)}원)</option>
                        ))}
                      </select>

                      {/* Billing Dropdown */}
                      <select 
                        value={config.billing}
                        onChange={(e) => updateServiceConfig(id, 'billing', e.target.value)}
                        className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-[#1A237E] w-full"
                      >
                        <option value="monthly">월간 결제</option>
                        <option value="yearly">연간 결제 (10% 할인)</option>
                      </select>

                      {/* Discount Dropdown */}
                      <select 
                        value={config.discount}
                        onChange={(e) => updateServiceConfig(id, 'discount', e.target.value)}
                        className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-2 outline-none focus:border-[#1A237E] w-full"
                      >
                        <option value="0">할인 없음</option>
                        <option value="10">10% 할인 (통신사 등)</option>
                        <option value="20">20% 할인 (신용카드)</option>
                        <option value="30">30% 할인 (프로모션)</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. My Contribution Settings */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-6">
           <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF153C] rounded-full"></span>
                나의 실제 분담금 설정
              </h3>
           </div>
           
           <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
             <button 
               onClick={() => setContribution({ type: 'n-divide', value: 1 })}
               className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${contribution.type === 'n-divide' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               1/N 정산
             </button>
             <button 
               onClick={() => setContribution({ type: 'percent', value: 50 })}
               className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${contribution.type === 'percent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               지정 비율 (%)
             </button>
             <button 
               onClick={() => setContribution({ type: 'fixed', value: 10000 })}
               className={`flex-1 py-2 rounded-lg text-xs font-black transition-all ${contribution.type === 'fixed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
             >
               직접 입력 (원)
             </button>
           </div>

           {contribution.type === 'n-divide' && (
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-600">공유 인원</span>
                  <span className="text-lg font-black text-[#2E7D32]">{contribution.value}명</span>
                </div>
                <input 
                  type="range" min="1" max="8" value={contribution.value} 
                  onChange={e => handleContributionChange('value', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]" 
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span>1명 (단독)</span>
                  <span>4명</span>
                  <span>8명</span>
                </div>
             </div>
           )}

           {contribution.type === 'percent' && (
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-600">부담 비율</span>
                  <span className="text-lg font-black text-[#FF153C]">{contribution.value}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="5" value={contribution.value} 
                  onChange={e => handleContributionChange('value', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FF153C]" 
                />
             </div>
           )}

           {contribution.type === 'fixed' && (
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-600">월 고정 부담금</span>
                  <span className="text-lg font-black text-[#1A237E]">{formatValue(contribution.value)}원</span>
                </div>
                <input 
                  type="number" min="0" step="1000" value={contribution.value} 
                  onChange={e => handleContributionChange('value', Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-right font-black text-slate-900 outline-none focus:border-[#1A237E]" 
                  placeholder="예: 10000"
                />
             </div>
           )}
        </div>

        {/* 4. Real-time Analysis Report Card */}
        <div className="bg-[#1A237E] rounded-[40px] p-10 shadow-2xl relative overflow-hidden text-white animate-fade-up">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           
           <div className="flex justify-between items-start mb-10">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">나의 실제 부담액</span>
              {totals.totalMonthly > 50000 && (
                <span className="bg-[#FFC107] text-slate-900 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg animate-pulse">OTT Diet Required</span>
              )}
           </div>

           <div className="space-y-2 mb-10 border-b border-white/10 pb-8">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Expected Monthly Expenditure</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black">{formatValue(totals.myMonthly)}</span>
                <span className="text-xl font-bold opacity-60">원 / 월</span>
              </div>
              <p className="text-xs font-medium text-white/70">
                (전체 총액: 월 {formatValue(totals.totalMonthly)}원 중 나의 부담분)
              </p>
           </div>

           <div className="grid grid-cols-2 gap-6 p-6 bg-white/10 rounded-3xl border border-white/10 mb-8">
              <div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">Annual Total (1년)</span>
                <span className="text-xl font-black">{formatValue(totals.myYearly)}원</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1">Saving Potential</span>
                <span className="text-xl font-black text-[#4CAF50]">{formatValue(totals.myYearly * 0.25)}원</span>
              </div>
           </div>

           {/* Cumulative Impact Visualizer */}
           <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-inner space-y-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]"></div>
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Cumulative Cost Impact</h4>
             
             <div className="flex justify-between items-end border-b border-slate-100 pb-4">
               <span className="text-sm font-bold text-slate-600">5년 유지 시</span>
               <div className="text-right">
                 <span className="text-2xl font-black text-[#FF153C]">{formatValue(totals.my5Year)}</span>
                 <span className="text-sm font-bold text-slate-400 ml-1">원</span>
               </div>
             </div>

             <div className="flex justify-between items-end pb-2">
               <span className="text-sm font-bold text-slate-600">10년 유지 시</span>
               <div className="text-right">
                 <span className="text-3xl font-black text-[#E50914]">{formatValue(totals.my10Year)}</span>
                 <span className="text-sm font-bold text-slate-400 ml-1">원</span>
               </div>
             </div>

             <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 items-start">
               <span className="text-xl">💡</span>
               <p className="text-xs font-black text-red-800 leading-relaxed">
                 {getOpportunityCost(totals.my10Year)}<br/>
                 <span className="text-[10px] font-bold text-red-600 mt-1 block">현재의 구독 습관이 10년 뒤의 미래를 바꿉니다. 정말 필요한 서비스만 남겨보세요.</span>
               </p>
             </div>
           </div>
        </div>

        {/* 5. Monetization Strategy Card */}
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
