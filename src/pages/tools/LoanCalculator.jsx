import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';
import ToolTabs from '../../components/ToolTabs';

export default function LoanCalculator() {
  const [step, setStep] = useState(1);
  const [loan, setLoan] = useState({ balance: 100000000, rate: 4.5, period: 360, method: 'equal-pi', gracePeriod: 0 });
  const [prepay, setPrepay] = useState({ amount: 10000000, feeRate: 1.2 });

  // --- Helpers ---
  const formatValue = (val) => Number(val).toLocaleString();
  const stripCommas = (str) => str.toString().replace(/,/g, '');
  const handleInput = (val, setter, obj, key) => {
    const raw = stripCommas(val);
    if (!isNaN(raw) || raw === '') setter({ ...obj, [key]: raw });
  };

  const calculation = useMemo(() => {
    const n = Number(loan.period);
    const g = Number(loan.gracePeriod);
    const prepayAmount = Number(prepay.amount);

    const remainingMonths = n - g;
    const savedInterest = (prepayAmount * (Number(loan.rate) / 100)) * (remainingMonths / 12) * 0.5; 
    const fee = prepayAmount * (Number(prepay.feeRate) / 100);
    const netBenefit = savedInterest - fee;

    let decision = 'WAIT';
    if (netBenefit > 500000) decision = 'YES';
    else if (netBenefit < 0) decision = 'NO';

    return { savedInterest, fee, netBenefit, decision };
  }, [loan, prepay]);

  const progress = (step / 3) * 100;

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans overflow-x-hidden">
      <SeoHelmet 
        title="대출 이자 & 중도상환 계산기 | LifeHub Finance" 
        description="중도상환 수수료를 내고도 이익일까요? 똑똑한 상환 전략을 세워보세요."
      />

      <ToolTabs activeCategory="finance" />

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="min-h-[500px]">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="space-y-3">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                   먼저 <span className="text-[#1A237E]">현재 대출 정보</span>를 <br/>알려주세요.
                 </h2>
                 <p className="text-slate-500 font-medium text-sm">이자 절감을 위한 기본 데이터를 수집합니다.</p>
               </div>

               <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-50 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">대출 잔액 (원)</label>
                    <input 
                      type="text" 
                      value={formatValue(loan.balance)} 
                      onChange={e=>handleInput(e.target.value, setLoan, loan, 'balance')} 
                      className="w-full text-4xl font-black text-[#1A237E] border-b-4 border-slate-50 focus:border-[#1A237E] outline-none pb-4 transition-all placeholder:text-slate-100"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">금리 (%)</label>
                      <input type="number" value={loan.rate} onChange={e=>setLoan({...loan, rate: e.target.value})} className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#1A237E] outline-none pb-2 transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">남은 기간 (개월)</label>
                      <input type="number" value={loan.period} onChange={e=>setLoan({...loan, period: e.target.value})} className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#1A237E] outline-none pb-2 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">거치 기간 (개월)</label>
                    <input type="number" value={loan.gracePeriod} onChange={e=>setLoan({...loan, gracePeriod: e.target.value})} className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#1A237E] outline-none pb-2 transition-all" />
                    <p className="text-[10px] text-slate-400 font-bold italic">이자만 납부하는 기간을 입력해 주세요.</p>
                  </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700">
               <div className="space-y-3">
                 <h2 className="text-3xl font-black text-[#2E7D32] tracking-tight leading-tight">
                   <span className="text-slate-900 underline decoration-emerald-500 decoration-4 underline-offset-8">상환 계획</span>이 <br/>어떻게 되시나요?
                 </h2>
                 <p className="text-slate-500 font-medium text-sm">상환 수수료와 이자 절감액을 대조합니다.</p>
               </div>

               <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-50 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">상환 예정 금액 (원)</label>
                    <input 
                      type="text" 
                      value={formatValue(prepay.amount)} 
                      onChange={e=>handleInput(e.target.value, setPrepay, prepay, 'amount')} 
                      className="w-full text-4xl font-black text-[#2E7D32] border-b-4 border-slate-50 focus:border-[#2E7D32] outline-none pb-4 transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">중도상환 수수료율 (%)</label>
                    <input type="number" value={prepay.feeRate} onChange={e=>setPrepay({...prepay, feeRate: e.target.value})} className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#2E7D32] outline-none pb-2 transition-all" />
                    <p className="text-[10px] text-slate-400 font-bold italic">보통 0.5% ~ 1.2% 사이입니다.</p>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#1A237E] tracking-tight">상환 전략 리포트</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Financial Strategy Analysis</p>
                  </div>
                  <div className="flex gap-2">
                     <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-[10px] font-black uppercase">Calculated</span>
                  </div>
               </div>

               {/* Decision Badge Card */}
               <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
                  <div className="mb-10 flex justify-center">
                    {calculation.decision === 'YES' && (
                      <div className="bg-[#2E7D32] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg animate-bounce">
                        💡 지금 상환을 강력 추천합니다!
                      </div>
                    )}
                    {calculation.decision === 'NO' && (
                      <div className="bg-rose-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                        ⚠️ 지금 상환은 손해입니다!
                      </div>
                    )}
                    {calculation.decision === 'WAIT' && (
                      <div className="bg-amber-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                        🤔 조금 더 고민해 보세요
                      </div>
                    )}
                  </div>

                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Interest Saving</h3>
                  <div className="text-6xl font-black text-[#1A237E] mb-4 tracking-tighter">{formatValue(Math.max(0, Math.round(calculation.netBenefit)))}원</div>
                  <p className="text-xs font-bold text-[#2E7D32] uppercase tracking-widest mb-12">
                    수수료를 모두 제외한 순이익입니다.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                        <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-tighter">아끼는 총 이자</span>
                        <span className="text-xl font-black text-[#2E7D32]">{formatValue(Math.round(calculation.savedInterest))}원</span>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-left">
                        <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-tighter">중도상환 수수료</span>
                        <span className="text-xl font-black text-rose-500">-{formatValue(Math.round(calculation.fee))}원</span>
                     </div>
                  </div>
               </div>

               {/* Refinancing Ads */}
               <div className="bg-gradient-to-br from-[#1A237E] to-[#283593] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group cursor-pointer border border-white/10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-white/10 transition-all"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Partner Refinancing Offer</h4>
                  <div className="space-y-4">
                     <div className="text-2xl font-black leading-tight">
                        금리 0.8% 더 낮은 <br/>대환 대출 상품이 있습니다.
                     </div>
                     <p className="text-xs font-medium opacity-70 leading-relaxed max-w-[80%]">
                        상환 수수료가 걱정되신다면 수수료를 전액 지원해주는 대환 상품을 확인해 보세요. 연간 약 240만 원의 추가 이익을 기대할 수 있습니다.
                     </p>
                     <div className="pt-4 flex items-center gap-3 text-sm font-black group-hover:translate-x-2 transition-transform">
                        비교 서비스 바로가기
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="mt-16 flex items-center justify-between">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))} 
              className={`px-8 py-4 font-black text-slate-400 hover:text-[#1A237E] transition-all flex items-center gap-2 ${step === 1 ? 'invisible' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            <button 
              onClick={() => setStep(step + 1)} 
              className="px-12 py-5 bg-[#1A237E] text-white font-black rounded-3xl shadow-xl hover:bg-black transition-all transform active:scale-95 flex items-center gap-3"
            >
               {step === 2 ? '최종 분석 확인' : '다음으로'}
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
               </svg>
            </button>
          </div>
        )}
        {step === 3 && (
           <button 
             onClick={() => setStep(1)}
             className="mt-8 w-full py-5 bg-white border border-slate-200 text-slate-400 rounded-[32px] font-black text-sm hover:text-[#1A237E] transition-all shadow-sm"
           >
              처음부터 다시 계산하기
           </button>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(30px); } to { transform: translateY(0); } }
        @keyframes slide-in-from-right { from { transform: translateX(30px); } to { transform: translateX(0); } }
        .animate-in { animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
}
