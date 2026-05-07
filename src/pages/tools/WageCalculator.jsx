import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function WageCalculator() {
  const [step, setStep] = useState(1);
  const [baseSalary, setBaseSalary] = useState(3000000);
  const [allowances, setAllowances] = useState([
    { id: 1, name: '직책수당', amount: 200000, isOrdinary: true },
    { id: 2, name: '식대', amount: 200000, isOrdinary: false }
  ]);
  const [isSmallBusiness, setIsSmallBusiness] = useState(false);
  const [actualHours, setActualHours] = useState({ overtime: 0, night: 0, holiday: 0 });
  const [receivedPay, setReceivedPay] = useState(0);

  // --- Calculation Logic ---
  const calculation = useMemo(() => {
    const totalOrdinary = Number(baseSalary) + allowances
      .filter(a => a.isOrdinary)
      .reduce((sum, a) => sum + Number(a.amount), 0);
    
    const hourly = totalOrdinary / 209;
    const multiplier = isSmallBusiness ? 1.0 : 1.5;
    const nightAdd = isSmallBusiness ? 0 : 0.5;

    const shouldPay = (Number(actualHours.overtime) * hourly * multiplier) + 
                     (Number(actualHours.night) * hourly * nightAdd) + 
                     (Number(actualHours.holiday) * hourly * multiplier);
    
    const diff = shouldPay - Number(receivedPay);
    // Benchmark logic: Minimum wage 2026 is approx 10,030 (placeholder)
    const minWage = 10030;
    const benchmarkRatio = Math.min((hourly / (minWage * 3)) * 100, 100);

    return { hourly, shouldPay, diff, isUnderpaid: diff > 100, benchmarkRatio };
  }, [baseSalary, allowances, isSmallBusiness, actualHours, receivedPay]);

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans overflow-x-hidden">
      <SeoHelmet 
        title="수당 감사 및 임금 계산기 | LifeHub Dashboard" 
        description="내 시급의 위치를 벤치마크 바로 확인하고 과소 지급 여부를 감사하세요."
      />

      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div className="h-full bg-[#1A237E] transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
      </div>

      <header className="bg-white border-b border-slate-100 py-6 sticky top-1.5 z-40">
        <div className="container mx-auto max-w-2xl px-6 flex justify-between items-center">
          <Link to="/" className="text-slate-400 hover:text-[#1A237E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WAGE AUDIT · STEP {step}</span>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="min-h-[550px]">
          {/* Step 1: Base Salary */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  <span className="text-[#1A237E]">기본급</span> 정보를 <br/>먼저 확인해 볼까요?
                </h2>
                <p className="text-slate-500 font-medium">시급 계산의 가장 기초가 되는 값입니다.</p>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">월 기본급 (원)</label>
                    <input 
                      type="number" 
                      value={baseSalary} 
                      onChange={e=>setBaseSalary(e.target.value)} 
                      className="w-full text-4xl font-black text-[#1A237E] border-b-2 border-slate-100 focus:border-[#1A237E] outline-none pb-2 transition-all"
                    />
                 </div>
                 
                 <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-4 block tracking-widest">사업장 규모</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                        onClick={()=>setIsSmallBusiness(false)}
                        className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${!isSmallBusiness ? 'bg-[#E8EAF6] border-[#1A237E] text-[#1A237E]' : 'bg-white border-slate-100 text-slate-400'}`}
                       >
                         5인 이상 (가산)
                       </button>
                       <button 
                        onClick={()=>setIsSmallBusiness(true)}
                        className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${isSmallBusiness ? 'bg-[#E8EAF6] border-[#1A237E] text-[#1A237E]' : 'bg-white border-slate-100 text-slate-400'}`}
                       >
                         5인 미만
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Step 2: Allowances Check */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  매달 받는 <span className="text-[#1A237E]">수당</span> 중에 <br/>고정적인 것이 있나요?
                </h2>
                <p className="text-slate-500 font-medium">통상임금에 포함되는 수당에 따라 시급이 달라집니다.</p>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
                 {allowances.map((a, idx) => (
                    <div key={a.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-100 transition-colors">
                       <div>
                          <span className="font-bold text-slate-800">{a.name}</span>
                          <span className="text-xs text-slate-400 block">{Number(a.amount).toLocaleString()}원</span>
                       </div>
                       <button 
                         onClick={() => {
                           const newArr = [...allowances];
                           newArr[idx].isOrdinary = !newArr[idx].isOrdinary;
                           setAllowances(newArr);
                         }}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${a.isOrdinary ? 'bg-[#1A237E] text-white border-[#1A237E] shadow-md' : 'bg-white text-slate-400 border-slate-200'}`}
                       >
                         {a.isOrdinary ? '통상임금 포함' : '미포함'}
                       </button>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {/* Step 3: Audit Actuals */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  이번 달 <span className="text-[#2E7D32]">실제 근무</span>는 <br/>어떠셨나요?
                </h2>
                <p className="text-slate-500 font-medium">명세서와 실제 근로를 대조해 봅니다.</p>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-black text-slate-400 mb-2 block tracking-widest">실제 연장근로(h)</label>
                      <input type="number" value={actualHours.overtime} onChange={e=>setActualHours({...actualHours, overtime: e.target.value})} className="w-full text-2xl font-black text-slate-900 border-b border-slate-100 focus:border-[#2E7D32] outline-none pb-1 transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 mb-2 block tracking-widest">실제 수당(원)</label>
                      <input type="number" value={receivedPay} onChange={e=>setReceivedPay(e.target.value)} className="w-full text-2xl font-black text-slate-900 border-b border-slate-100 focus:border-[#2E7D32] outline-none pb-1 transition-all" />
                    </div>
                 </div>
                 
                 <div className="p-6 bg-[#1A237E] rounded-[32px] text-white shadow-xl">
                    <div className="flex justify-between items-center opacity-60 text-[10px] font-black mb-2 uppercase tracking-widest">
                       <span>Estimated Wage (Legal)</span>
                       <span className="text-[#A5D6A7]">HOURLY: {Math.round(calculation.hourly).toLocaleString()}원</span>
                    </div>
                    <div className="text-3xl font-black tracking-tighter">
                       {Math.round(calculation.shouldPay).toLocaleString()}원
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Summary Dashboard */}
          {step === 4 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="flex justify-between items-end mb-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#1A237E] tracking-tight">임금 감사 리포트</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Wage Benchmark Insight</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${calculation.isUnderpaid ? 'bg-rose-100 text-rose-600' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                    {calculation.isUnderpaid ? 'Audit Alert' : 'Verified'}
                  </span>
               </div>

               {/* Benchmark Bar Card */}
               <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Hourly Wage Benchmark</h3>
                  
                  <div className="space-y-8 mb-10">
                     <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter px-1">
                        <span>Min Wage</span>
                        <span>Avg</span>
                        <span>Premium</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full relative">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1A237E] to-[#2E7D32] rounded-full relative transition-all duration-1000 ease-out" 
                          style={{ width: `${calculation.benchmarkRatio}%` }}
                        >
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-4 border-[#2E7D32] rounded-full shadow-md" />
                           <div className="absolute -top-10 right-0 translate-x-1/2 bg-[#2E7D32] text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap shadow-lg">
                              나의 시급: {Math.round(calculation.hourly).toLocaleString()}원
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className={`p-8 rounded-3xl text-white ${calculation.isUnderpaid ? 'bg-rose-600 shadow-[0_15px_30px_-10px_rgba(225,29,72,0.4)]' : 'bg-[#1A237E] shadow-[0_15px_30px_-10px_rgba(26,35,126,0.4)]'}`}>
                     <div className="text-4xl font-black tracking-tighter mb-4 leading-none">
                        {calculation.isUnderpaid ? '과소 지급 의심' : '적정 임금 수준'}
                     </div>
                     <p className="text-xs font-medium leading-relaxed opacity-80">
                        {calculation.isUnderpaid 
                         ? `법정 기준 대비 약 ${Math.round(calculation.diff).toLocaleString()}원이 부족하게 지급되었습니다. 통상임금 범위와 가산율 1.5배 적용 여부를 인사팀에 문의해 보세요.` 
                         : `현재 시급은 법정 최저임금을 상회하며, 수당 계산이 올바르게 이루어지고 있습니다.`}
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-[#1A237E] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-[#151b66] transition-all">
                    명세서 대조 가이드
                  </button>
                  <button onClick={()=>setStep(1)} className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                    다시 계산
                  </button>
               </div>
            </div>
          )}
        </div>

        {step < 4 && (
          <div className="mt-12 flex items-center justify-between">
            <button onClick={prevStep} className={`px-6 py-3 font-bold text-slate-400 hover:text-[#1A237E] transition-all ${step === 1 ? 'invisible' : ''}`}>이전 단계</button>
            <button onClick={() => setStep(s => s + 1)} className="px-10 py-4 bg-[#1A237E] text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all transform active:scale-95">
               {step === 3 ? '최종 결과 확인' : '다음으로'}
            </button>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-right { from { transform: translateX(20px); } to { transform: translateX(0); } }
        .animate-in { animation: fade-in 0.4s ease-out, slide-in-from-right 0.4s ease-out; }
      `}} />
    </div>
  );
}
