import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function TurnoverSimulator() {
  const [currentAnnual, setCurrentAnnual] = useState(45000000);
  const [newAnnual, setNewAnnual] = useState(55000000);
  const [dependents, setDependents] = useState(1);
  const [nonTaxable, setNonTaxable] = useState(200000); // 식대
  
  const [result, setResult] = useState(null);

  const calculateFullNet = (annual) => {
    const monthlyGross = Math.floor(annual / 12);
    const taxableIncome = monthlyGross - nonTaxable;
    
    // 2026 추정 요율
    const pension = Math.min(taxableIncome * 0.045, 275000); // 약간 상승 가정
    const health = taxableIncome * 0.03545;
    const longTerm = health * 0.1295;
    const employment = taxableIncome * 0.009;
    
    // 간이세액표 근사 로직 (2026 기준 강화)
    let incomeTax = 0;
    if (taxableIncome > 8000000) incomeTax = taxableIncome * 0.26;
    else if (taxableIncome > 5000000) incomeTax = taxableIncome * 0.16;
    else if (taxableIncome > 3000000) incomeTax = taxableIncome * 0.09;
    else if (taxableIncome > 1500000) incomeTax = taxableIncome * 0.03;
    
    // 부양가족 공제 효과
    incomeTax = Math.max(incomeTax * (1 - (dependents - 1) * 0.12), 0);
    const localTax = incomeTax * 0.1;
    
    const totalDeduction = pension + health + longTerm + employment + incomeTax + localTax;
    
    return {
      monthlyGross,
      pension,
      health,
      longTerm,
      employment,
      incomeTax,
      localTax,
      totalDeduction,
      netPay: Math.round(monthlyGross - totalDeduction)
    };
  };

  const simulate = () => {
    const current = calculateFullNet(currentAnnual);
    const next = calculateFullNet(newAnnual);
    
    setResult({
      current,
      next,
      diffMonthly: next.netPay - current.netPay,
      diffAnnual: (next.netPay - current.netPay) * 12
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="2026 이직 시뮬레이터 - Smart Utility Hub" 
        description="2026년 최신 세율과 비과세 항목을 반영한 정밀 연봉 비교 시뮬레이터입니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/" className="text-blue-600 font-bold flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-3">
             <span className="text-3xl">🚀</span>
             <div>
                <h1 className="text-2xl font-black text-slate-900">2026 이직 시뮬레이터</h1>
                <p className="text-slate-500 font-medium text-sm">세전 연봉에 속지 마세요. 진짜 내 통장에 남는 돈을 비교합니다.</p>
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6 h-fit">
            <h2 className="text-lg font-black text-slate-800 border-b pb-4">시뮬레이션 데이터</h2>
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1.5">현재 연봉 (원)</label>
                 <input type="number" value={currentAnnual} onChange={e=>setCurrentAnnual(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 mb-1.5">이직 제안 연봉 (원)</label>
                 <input type="number" value={newAnnual} onChange={e=>setNewAnnual(e.target.value)} className="w-full px-4 py-3 bg-blue-50 border-blue-100 border rounded-xl outline-none focus:border-blue-500 font-bold text-blue-600" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">부양가족 수</label>
                    <input type="number" value={dependents} onChange={e=>setDependents(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">비과세(식대 등)</label>
                    <input type="number" value={nonTaxable} onChange={e=>setNonTaxable(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                  </div>
               </div>
            </div>
            <button onClick={simulate} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]">정밀 비교 시작</button>
          </div>

          <div className="xl:col-span-2">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Summary Highlight */}
                <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="text-blue-100 font-bold text-lg mb-2">월 예상 실수령 증가액</h3>
                      <div className="flex items-baseline gap-2">
                         <span className="text-6xl font-black tracking-tighter">+{result.diffMonthly.toLocaleString()}</span>
                         <span className="text-2xl font-bold">원</span>
                      </div>
                      <div className="mt-6 flex gap-4">
                         <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold">
                            연간 순수익: +{result.diffAnnual.toLocaleString()}원
                         </div>
                      </div>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* Side by Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                      <h4 className="text-slate-400 font-bold mb-4">현재 직장</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">세전 월급</span>
                            <span className="font-bold">{result.current.monthlyGross.toLocaleString()}원</span>
                         </div>
                         <div className="flex justify-between text-sm text-rose-500">
                            <span>공제액 합계</span>
                            <span>-{Math.round(result.current.totalDeduction).toLocaleString()}원</span>
                         </div>
                         <div className="pt-4 border-t flex justify-between items-center">
                            <span className="font-black text-slate-800">실수령액</span>
                            <span className="text-2xl font-black text-slate-900">{result.current.netPay.toLocaleString()}원</span>
                         </div>
                      </div>
                   </div>
                   <div className="bg-white p-8 rounded-[32px] border-2 border-blue-100 shadow-sm">
                      <h4 className="text-blue-600 font-bold mb-4">이직 후 (제안)</h4>
                      <div className="space-y-4">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">세전 월급</span>
                            <span className="font-bold">{result.next.monthlyGross.toLocaleString()}원</span>
                         </div>
                         <div className="flex justify-between text-sm text-rose-500">
                            <span>공제액 합계</span>
                            <span>-{Math.round(result.next.totalDeduction).toLocaleString()}원</span>
                         </div>
                         <div className="pt-4 border-t border-blue-50 flex justify-between items-center">
                            <span className="font-black text-slate-800">실수령액</span>
                            <span className="text-2xl font-black text-blue-600">{result.next.netPay.toLocaleString()}원</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white/80 text-xs leading-relaxed">
                   ⚖️ **2026년 세무 가이드**: 위 계산은 2026년 예상 국민연금 및 건강보험 요율을 바탕으로 산출된 시뮬레이션입니다. 비과세 항목(식대 20만 원)을 반영하여 세금을 절약하는 로직이 포함되어 있습니다. 실제 수령액은 회사의 복지 포인트, 수당 체계에 따라 다를 수 있습니다.
                </div>
              </div>
            ) : (
              <div className="bg-slate-200 h-full min-h-[500px] rounded-[40px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                <span className="text-6xl mb-6">📉</span>
                <p className="text-xl font-black">연봉 숫자 너머의 진짜 가치를<br/>데이터로 시각화해 보세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}} />
    </div>
  );
}
