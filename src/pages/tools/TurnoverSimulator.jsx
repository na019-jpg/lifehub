import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function TurnoverSimulator() {
  const [currentAnnual, setCurrentAnnual] = useState(40000000);
  const [newAnnual, setNewAnnual] = useState(50000000);
  const [dependents, setDependents] = useState(1);
  const [nonTaxable, setNonTaxable] = useState(200000); // 식대 등
  
  const [result, setResult] = useState(null);

  const calculateNetPay = (annual) => {
    const monthlyGross = Math.floor(annual / 12);
    const taxableIncome = monthlyGross - nonTaxable;
    
    // 4대보험 요율 (2024-2025 기준 근사치)
    const pension = Math.min(taxableIncome * 0.045, 265500); // 국민연금 (상한선 반영)
    const health = taxableIncome * 0.03545; // 건강보험
    const longTermCare = health * 0.1295; // 장기요양
    const employment = taxableIncome * 0.009; // 고용보험
    
    // 간이세액표 기반 소득세 (매우 간소화된 공식)
    // 실제로는 국세청 간이세액표를 조회해야 하지만, 시뮬레이션용 근사식 사용
    let incomeTax = 0;
    if (taxableIncome > 10000000) incomeTax = taxableIncome * 0.25;
    else if (taxableIncome > 6000000) incomeTax = taxableIncome * 0.15;
    else if (taxableIncome > 3000000) incomeTax = taxableIncome * 0.08;
    else if (taxableIncome > 1500000) incomeTax = taxableIncome * 0.02;
    
    // 부양가족에 따른 소득세 감면 (간소화)
    incomeTax = Math.max(incomeTax * (1 - (dependents - 1) * 0.1), 0);
    
    const localTax = incomeTax * 0.1;
    
    const totalDeductions = pension + health + longTermCare + employment + incomeTax + localTax;
    const netPay = monthlyGross - totalDeductions;
    
    return {
      monthlyGross,
      pension,
      health,
      longTermCare,
      employment,
      incomeTax,
      localTax,
      totalDeductions,
      netPay: Math.round(netPay)
    };
  };

  const simulate = () => {
    const current = calculateNetPay(currentAnnual);
    const next = calculateNetPay(newAnnual);
    
    setResult({
      current,
      next,
      difference: next.netPay - current.netPay
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="이직 시뮬레이터 (실수령액 비교) - Smart Utility Hub" 
        description="이직 전후의 연봉을 입력하여 실제 통장에 찍히는 월 실수령액 차이를 확인하세요."
      />
      
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/" className="text-blue-600 font-bold flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-black text-slate-900">🚀 이직 시뮬레이터</h1>
          <p className="text-slate-500 font-medium mt-2">연봉 숫자에 속지 마세요. 세금 떼고 내 통장에 남는 진짜 돈을 비교합니다.</p>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-800 mb-6">시뮬레이션 조건</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">현재 연봉 (원)</label>
                  <input 
                    type="number" 
                    value={currentAnnual}
                    onChange={(e) => setCurrentAnnual(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                    step="1000000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">이직 제안 연봉 (원)</label>
                  <input 
                    type="number" 
                    value={newAnnual}
                    onChange={(e) => setNewAnnual(e.target.value)}
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-blue-600"
                    step="1000000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">부양가족(본인포함)</label>
                    <input 
                      type="number" 
                      value={dependents}
                      onChange={(e) => setDependents(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">비과세액(식대 등)</label>
                    <input 
                      type="number" 
                      value={nonTaxable}
                      onChange={(e) => setNonTaxable(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                    />
                  </div>
                </div>

                <button 
                  onClick={simulate}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-all"
                >
                  실수령액 비교하기
                </button>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Highlight Card */}
                <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V2a1 1 0 112 0v5a1 1 0 01-1 1h-6zM3 13a1 1 0 110-2h5V6a1 1 0 011 1v5a1 1 0 01-1 1H3z" clipRule="evenodd" /></svg>
                  </div>
                  <h3 className="text-slate-400 font-bold mb-2">월 예상 실수령액 상승분</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-blue-400">+{result.difference.toLocaleString()}</span>
                    <span className="text-xl font-bold text-slate-400">원 / 월</span>
                  </div>
                  <p className="mt-4 text-slate-400 text-sm">
                    연봉은 {(newAnnual - currentAnnual).toLocaleString()}원 올랐지만, <br/>
                    각종 세금과 보험료를 제외한 **실제 지갑 사정**은 매달 위 금액만큼 좋아집니다.
                  </p>
                </div>

                {/* Detailed Comparison Table */}
                <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="p-6 text-sm font-black text-slate-500">항목</th>
                        <th className="p-6 text-sm font-black text-slate-500 text-right">현재</th>
                        <th className="p-6 text-sm font-black text-blue-600 text-right">이직 후</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-6 font-bold text-slate-700">월 세전 급여</td>
                        <td className="p-6 text-right font-medium">{result.current.monthlyGross.toLocaleString()}원</td>
                        <td className="p-6 text-right font-black text-slate-900">{result.next.monthlyGross.toLocaleString()}원</td>
                      </tr>
                      <tr>
                        <td className="p-6 font-bold text-slate-500 text-sm">4대 보험 공제</td>
                        <td className="p-6 text-right text-sm text-slate-400">-{Math.round(result.current.pension + result.current.health + result.current.longTermCare + result.current.employment).toLocaleString()}원</td>
                        <td className="p-6 text-right text-sm text-rose-400">-{Math.round(result.next.pension + result.next.health + result.next.longTermCare + result.next.employment).toLocaleString()}원</td>
                      </tr>
                      <tr>
                        <td className="p-6 font-bold text-slate-500 text-sm">소득세/지방세</td>
                        <td className="p-6 text-right text-sm text-slate-400">-{Math.round(result.current.incomeTax + result.current.localTax).toLocaleString()}원</td>
                        <td className="p-6 text-right text-sm text-rose-400">-{Math.round(result.next.incomeTax + result.next.localTax).toLocaleString()}원</td>
                      </tr>
                      <tr className="bg-blue-50/30">
                        <td className="p-6 font-black text-slate-800">월 실수령액</td>
                        <td className="p-6 text-right font-bold text-slate-500">{result.current.netPay.toLocaleString()}원</td>
                        <td className="p-6 text-right font-black text-blue-600 text-xl">{result.next.netPay.toLocaleString()}원</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 h-full min-h-[400px] rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-4xl mb-6">📊</div>
                <h3 className="text-xl font-black text-slate-700 mb-2">실수령액 리포트 준비 완료</h3>
                <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
                  현재 연봉과 이직할 연봉을 입력하시면 <br/>
                  세금과 보험료를 모두 제외한 리얼 데이터를 분석해 드립니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}
