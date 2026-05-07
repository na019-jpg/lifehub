import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function TurnoverSimulator() {
  // --- State Management ---
  const [current, setCurrent] = useState({
    annual: 45000000,
    bonus: 3000000,
    commuteMin: 30,
    commuteCost: 100000,
    nonTaxable: 200000
  });

  const [target, setTarget] = useState({
    annual: 55000000,
    bonus: 5000000,
    commuteMin: 60,
    commuteCost: 150000,
    nonTaxable: 200000
  });

  const [dependents, setDependents] = useState(1);
  const [result, setResult] = useState(null);

  // --- Core Calculation Logic ---
  const analyzeSalary = (data) => {
    const monthlyGross = Math.floor(data.annual / 12);
    const taxableIncome = monthlyGross - data.nonTaxable;
    
    // 2026 Estimated Tax Rates
    const pension = Math.min(taxableIncome * 0.045, 275000);
    const health = taxableIncome * 0.03545;
    const longTerm = health * 0.1295;
    const employment = taxableIncome * 0.009;
    
    let incomeTax = 0;
    if (taxableIncome > 8000000) incomeTax = taxableIncome * 0.26;
    else if (taxableIncome > 5000000) incomeTax = taxableIncome * 0.16;
    else if (taxableIncome > 3000000) incomeTax = taxableIncome * 0.09;
    else incomeTax = taxableIncome * 0.03;
    
    incomeTax = Math.max(incomeTax * (1 - (dependents - 1) * 0.12), 0);
    const localTax = incomeTax * 0.1;
    
    const totalDeduction = pension + health + longTerm + employment + incomeTax + localTax;
    const netMonthly = Math.round(monthlyGross - totalDeduction);
    
    // Total Rewards (Annual Net + Bonus + Severance)
    const annualNet = netMonthly * 12 + Number(data.bonus);
    const severanceAccrual = Math.round(data.annual / 12); // Expected monthly accrual
    
    // Opportunity Cost of Commute
    const hourlyRate = netMonthly / 209;
    const commuteOpportunityCost = (data.commuteMin * 2 * 20 / 60) * hourlyRate; // Monthly cost of time
    
    return {
      monthlyGross,
      netMonthly,
      annualNet,
      totalRewards: annualNet + (Number(data.annual) / 12),
      commuteOpportunityCost,
      actualEconomicValue: netMonthly - commuteOpportunityCost - Number(data.commuteCost)
    };
  };

  const simulate = () => {
    const currentAnalysis = analyzeSalary(current);
    const targetAnalysis = analyzeSalary(target);
    
    setResult({
      current: currentAnalysis,
      target: targetAnalysis,
      netDiff: targetAnalysis.netMonthly - currentAnalysis.netMonthly,
      rewardDiff: targetAnalysis.totalRewards - currentAnalysis.totalRewards,
      economicDiff: targetAnalysis.actualEconomicValue - currentAnalysis.actualEconomicValue
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans selection:bg-blue-100">
      <SeoHelmet 
        title="프리미엄 이직 시뮬레이터 | LifeHub" 
        description="단순 연봉 비교를 넘어 출퇴근 기회비용과 총 보상을 분석하여 이직의 진짜 가치를 판단하세요."
      />
      
      <header className="bg-white border-b border-slate-200 py-8 sticky top-0 z-30 backdrop-blur-md bg-white/90">
        <div className="container mx-auto max-w-6xl px-4 flex justify-between items-center">
          <div>
            <Link to="/" className="text-blue-600 font-bold text-sm flex items-center gap-1 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로 돌아가기
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">🚀 프리미엄 이직 시뮬레이터</h1>
          </div>
          <div className="hidden md:block">
            <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black border border-blue-100">
              VER 2026.05 정밀 분석 엔진
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Left Panel: Inputs */}
          <div className="xl:col-span-4 space-y-8">
            {/* Current Salary Section */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">현재 직장 조건</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">연봉 (원)</label>
                  <input 
                    type="number" 
                    value={current.annual} 
                    onChange={e => setCurrent({...current, annual: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">예상 성과급</label>
                    <input type="number" value={current.bonus} onChange={e => setCurrent({...current, bonus: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">편도 출퇴근(분)</label>
                    <input type="number" value={current.commuteMin} onChange={e => setCurrent({...current, commuteMin: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl font-bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* Target Salary Section */}
            <div className="bg-blue-600 p-8 rounded-[32px] shadow-xl text-white">
              <h2 className="text-sm font-black text-blue-200 uppercase tracking-widest mb-6">이직 제안 조건</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-blue-100 mb-2">제안 연봉 (원)</label>
                  <input 
                    type="number" 
                    value={target.annual} 
                    onChange={e => setTarget({...target, annual: e.target.value})}
                    className="w-full px-5 py-4 bg-white/10 border-0 rounded-2xl font-black text-white placeholder:text-white/30 focus:ring-2 focus:ring-white transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-100 mb-2">예상 성과급</label>
                    <input type="number" value={target.bonus} onChange={e => setTarget({...target, bonus: e.target.value})} className="w-full px-5 py-4 bg-white/10 border-0 rounded-2xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-100 mb-2">편도 출퇴근(분)</label>
                    <input type="number" value={target.commuteMin} onChange={e => setTarget({...target, commuteMin: e.target.value})} className="w-full px-5 py-4 bg-white/10 border-0 rounded-2xl font-bold" />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={simulate}
              className="w-full py-6 bg-slate-900 hover:bg-black text-white font-black rounded-3xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              종합 경제 가치 분석 시작 🔍
            </button>
          </div>

          {/* Right Panel: Insights */}
          <div className="xl:col-span-8">
            {result ? (
              <div className="space-y-8 animate-fade-in">
                {/* Visual Insight Card */}
                <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                         <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                         <h3 className="text-slate-400 font-bold text-sm tracking-widest uppercase">실질 경제 가치 변화</h3>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                         <div>
                            <div className="flex items-baseline gap-2">
                               <span className={`text-7xl font-black tracking-tighter ${result.economicDiff >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                                  {result.economicDiff >= 0 ? '+' : ''}{Math.round(result.economicDiff).toLocaleString()}
                               </span>
                               <span className="text-2xl font-bold text-slate-400">원 / 월</span>
                            </div>
                            <p className="mt-4 text-slate-500 font-medium leading-relaxed max-w-md">
                               세금, 4대보험, 성과급뿐만 아니라 <span className="text-slate-900 font-bold">증가한 출퇴근 시간의 기회비용</span>까지 모두 반영한 월간 실질 이득입니다.
                            </p>
                         </div>
                         
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 min-w-[240px]">
                            <h4 className="text-xs font-black text-slate-400 mb-3 uppercase">총 보상 (Annual Total Rewards)</h4>
                            <div className="space-y-2">
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500 font-bold">이직 후</span>
                                  <span className="font-black text-blue-600">{Math.round(result.target.totalRewards).toLocaleString()}원</span>
                               </div>
                               <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-500 font-bold">차액</span>
                                  <span className="font-black text-emerald-500">+{Math.round(result.rewardDiff).toLocaleString()}원</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
                </div>

                {/* Detailed Analytics Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Net Pay Box */}
                   <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                      <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                         <span className="text-blue-500">●</span> 세후 실수령액 (Net Pay)
                      </h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">현재 직장</span>
                            <span className="font-bold text-slate-400">{result.current.netMonthly.toLocaleString()}원</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">이직 후</span>
                            <span className="font-black text-slate-900 text-lg">{result.target.netMonthly.toLocaleString()}원</span>
                         </div>
                         <div className="pt-4 border-t flex justify-between items-center">
                            <span className="text-sm font-black text-blue-600">월 상승분</span>
                            <span className="font-black text-blue-600 text-xl">+{result.netDiff.toLocaleString()}원</span>
                         </div>
                      </div>
                   </div>

                   {/* Commute Insight Box */}
                   <div className="bg-slate-900 p-8 rounded-[32px] text-white">
                      <h4 className="font-black text-white/50 mb-6 flex items-center gap-2">
                         <span className="text-rose-500">●</span> 시간의 가치 (Opportunity Cost)
                      </h4>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40 font-medium">월 출퇴근 매몰 비용</span>
                            <span className="font-bold text-white/60">-{Math.round(result.target.commuteOpportunityCost).toLocaleString()}원</span>
                         </div>
                         <div className="p-4 bg-white/5 rounded-2xl">
                            <p className="text-[11px] leading-relaxed text-white/60">
                               당신의 시급을 기준으로 환산한 한 달 출퇴근 시간의 경제적 가치입니다. 출퇴근 시간이 길어질수록 이 금액만큼 연봉이 삭감되는 효과가 있습니다.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Final Recommendation */}
                <div className={`p-8 rounded-[32px] border-2 ${result.economicDiff > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'}`}>
                   <h5 className="font-black mb-2 flex items-center gap-2 text-lg">
                      {result.economicDiff > 0 ? '✅ 이직을 긍정적으로 검토하세요!' : '⚠️ 다시 한번 고민해 보세요.'}
                   </h5>
                   <p className="text-sm font-medium leading-relaxed opacity-80">
                      {result.economicDiff > 0 
                        ? `모든 기회비용을 제외하고도 매달 약 ${Math.round(result.economicDiff).toLocaleString()}원의 추가 가치가 발생합니다. 커리어 성장을 위해 좋은 기회일 수 있습니다.` 
                        : `연봉은 오르지만 늘어난 출퇴근 시간과 세금 공제를 따져보니 실질적인 경제 이득은 크지 않습니다. 워라밸이나 조직 문화를 더 중요하게 고려해야 할 시점입니다.`}
                   </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/40 h-full min-h-[600px] rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                 <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">💡</div>
                 <h3 className="text-2xl font-black text-slate-800 mb-3">당신의 확신을 위한 시뮬레이션</h3>
                 <p className="text-slate-400 font-medium leading-relaxed max-w-md">
                    왼쪽 패널에 연봉과 출퇴근 조건을 입력해 주세요. <br/>
                    빅데이터와 노무 로직을 결합하여 <br/>
                    당신을 위한 **커리어 결정 보고서**를 생성해 드립니다.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
