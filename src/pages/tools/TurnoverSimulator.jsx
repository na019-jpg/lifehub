import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function TurnoverSimulator() {
  const [step, setStep] = useState(1);
  const [current, setCurrent] = useState({ annual: 45000000, bonus: 300000, commuteMin: 30, commuteCost: 100000 });
  const [target, setTarget] = useState({ annual: 55000000, bonus: 500000, commuteMin: 60, commuteCost: 150000 });
  const [nonTaxable, setNonTaxable] = useState(200000);

  // --- Calculation Logic ---
  const analyze = (data) => {
    const monthlyGross = Math.floor(data.annual / 12);
    const taxable = monthlyGross - nonTaxable;
    const deductions = taxable * 0.18; // Simplified for live preview
    const netMonthly = monthlyGross - deductions;
    const hourlyRate = netMonthly / 209;
    const timeValue = (data.commuteMin * 2 * 20 / 60) * hourlyRate;
    return { netMonthly, timeValue, totalValue: netMonthly - timeValue - Number(data.commuteCost) };
  };

  const currentStats = useMemo(() => analyze(current), [current]);
  const targetStats = useMemo(() => analyze(target), [target]);
  const netDiff = targetStats.netMonthly - currentStats.netMonthly;

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans selection:bg-indigo-100 overflow-x-hidden">
      <SeoHelmet 
        title="이직 시뮬레이터 | LifeHub Dashboard" 
        description="Side-by-Side 분석으로 이직의 진짜 경제적 가치를 확인하세요."
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div 
          className="h-full bg-[#1A237E] transition-all duration-500 ease-out" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <header className="bg-white border-b border-slate-100 py-6 sticky top-1.5 z-40 backdrop-blur-md bg-white/80">
        <div className="container mx-auto max-w-2xl px-6 flex justify-between items-center">
          <Link to="/" className="text-slate-400 hover:text-[#1A237E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} of 4</span>
          </div>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="min-h-[500px]">
          {/* Step 1: Current Status */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  먼저, <span className="text-[#1A237E]">현재 처우</span>를 <br/>알려주시겠습니까?
                </h2>
                <p className="text-slate-500 font-medium">비교의 기준점이 되는 현재 연봉 정보가 필요합니다.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">현재 세전 연봉 (원)</label>
                      <input 
                        type="number" 
                        value={current.annual}
                        onChange={e => setCurrent({...current, annual: e.target.value})}
                        className="w-full text-4xl font-black text-[#1A237E] bg-transparent border-b-2 border-slate-100 focus:border-[#1A237E] outline-none pb-2 transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">월 출퇴근 비용</label>
                        <input 
                          type="number" 
                          value={current.commuteCost}
                          onChange={e => setCurrent({...current, commuteCost: e.target.value})}
                          className="w-full text-xl font-black text-slate-900 border-b border-slate-100 focus:border-[#1A237E] outline-none pb-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">편도 통근(분)</label>
                        <input 
                          type="number" 
                          value={current.commuteMin}
                          onChange={e => setCurrent({...current, commuteMin: e.target.value})}
                          className="w-full text-xl font-black text-slate-900 border-b border-slate-100 focus:border-[#1A237E] outline-none pb-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Status */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  <span className="text-[#2E7D32]">제안받은 조건</span>은 <br/>어떤가요?
                </h2>
                <p className="text-slate-500 font-medium">새로운 시작을 위한 조건을 입력해 주세요.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">제안받은 세전 연봉 (원)</label>
                      <input 
                        type="number" 
                        value={target.annual}
                        onChange={e => setTarget({...target, annual: e.target.value})}
                        className="w-full text-4xl font-black text-[#2E7D32] bg-transparent border-b-2 border-slate-100 focus:border-[#2E7D32] outline-none pb-2 transition-all"
                        autoFocus
                      />
                    </div>
                    <div className="p-4 bg-[#E8F5E9] rounded-2xl flex items-center justify-between border border-[#A5D6A7]">
                       <span className="text-xs font-bold text-[#2E7D32]">현재보다 세후 월</span>
                       <span className="text-lg font-black text-[#2E7D32]">+{netDiff.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Detailed Logic */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  마지막으로 <span className="text-[#1A237E]">디테일</span>을 <br/>조정해 볼까요?
                </h2>
                <p className="text-slate-500 font-medium">정밀한 분석을 위해 필요한 정보입니다.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-black text-slate-400 uppercase">비과세 식대 (월)</label>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold tracking-tight">TAX SAVING</span>
                      </div>
                      <input type="range" min="0" max="300000" step="50000" value={nonTaxable} onChange={e=>setNonTaxable(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]" />
                      <div className="flex justify-between mt-2 font-black text-[#1A237E] text-sm">
                        <span>0원</span>
                        <span>{Number(nonTaxable).toLocaleString()}원</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Summary Dashboard */}
          {step === 4 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
               <div className="flex justify-between items-end mb-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#1A237E] tracking-tight">커리어 가치 리포트</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Career Insight Dashboard</p>
                  </div>
                  <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-3 py-1 rounded-full text-[10px] font-black uppercase">Analyzed</span>
               </div>

               {/* Main Metric: Side-by-Side Bar Chart Card */}
               <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Annual Total Rewards (Net)</h3>
                  
                  <div className="flex items-end justify-around h-56 gap-8 mb-10 px-4">
                     {/* Current Bar */}
                     <div className="flex flex-col items-center flex-1 gap-4 group">
                        <div className="w-full bg-[#1A237E] rounded-t-3xl relative transition-all duration-700 hover:scale-105" style={{height: '65%'}}>
                           <div className="absolute top-0 w-full h-1/5 bg-slate-200/40 rounded-t-3xl" title="Tax/Insurance Deductions" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Current</span>
                     </div>
                     
                     {/* Target Bar */}
                     <div className="flex flex-col items-center flex-1 gap-4 group">
                        <div className="w-full bg-gradient-to-t from-[#2E7D32] to-[#4CAF50] rounded-t-3xl relative transition-all duration-700 hover:scale-105 shadow-[0_10px_20px_-5px_rgba(46,125,50,0.3)]" style={{height: '90%'}}>
                           <div className="absolute top-0 w-full h-1/6 bg-slate-200/40 rounded-t-3xl" title="Tax/Insurance Deductions" />
                        </div>
                        <span className="text-[10px] font-black text-[#2E7D32] tracking-widest uppercase">Target</span>
                     </div>
                  </div>

                  <div className="p-6 bg-[#F8F9FA] rounded-3xl border border-slate-100">
                     <p className="text-sm font-medium leading-relaxed text-slate-600 text-center">
                        "실수령액 기준 월 <span className="text-[#2E7D32] font-black">{netDiff.toLocaleString()}원</span>의 가치가 상승하지만, 
                        통근 기회비용을 고려한 순 가치 변화는 <span className="text-[#1A237E] font-black">{Math.round(targetStats.totalValue - currentStats.totalValue).toLocaleString()}원</span>입니다."
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-[#1A237E] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-[#151b66] transition-all active:scale-95">
                    리포트 PDF 저장
                  </button>
                  <button onClick={() => setStep(1)} className="py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                    다시 시뮬레이션
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step < 4 && (
          <div className="mt-12 flex items-center justify-between">
            <button 
              onClick={prevStep}
              className={`px-6 py-3 font-bold text-slate-400 hover:text-[#1A237E] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              이전 단계
            </button>
            <button 
              onClick={nextStep}
              className="px-10 py-4 bg-[#1A237E] text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all transform active:scale-95"
            >
              {step === 3 ? '최종 분석 리포트 확인' : '다음으로'}
            </button>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(20px); } to { transform: translateY(0); } }
        .animate-in { animation: fade-in 0.4s ease-out, slide-in-from-bottom 0.4s ease-out; }
      `}} />
    </div>
  );
}
