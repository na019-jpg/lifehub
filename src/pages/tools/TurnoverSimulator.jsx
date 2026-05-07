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
    <div className="bg-slate-50 min-h-screen pb-20 font-sans selection:bg-blue-100 overflow-x-hidden">
      <SeoHelmet 
        title="이직 시뮬레이터 (대화형) | LifeHub" 
        description="단계별 가이드를 통해 이직의 진짜 경제적 가치를 분석하세요."
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-out" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <header className="bg-white border-b border-slate-100 py-6 sticky top-1.5 z-40 backdrop-blur-md bg-white/80">
        <div className="container mx-auto max-w-2xl px-6 flex justify-between items-center">
          <Link to="/" className="text-slate-400 hover:text-slate-900 transition-colors">
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
                  먼저, <span className="text-blue-600">현재 처우</span>를 <br/>알려주시겠습니까?
                </h2>
                <p className="text-slate-500 font-medium">비교의 기준점이 되는 현재 연봉 정보가 필요합니다.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block">현재 세전 연봉 (원)</label>
                      <input 
                        type="number" 
                        value={current.annual}
                        onChange={e => setCurrent({...current, annual: e.target.value})}
                        className="w-full text-4xl font-black text-slate-900 bg-transparent border-b-2 border-slate-100 focus:border-blue-600 outline-none pb-2 transition-all"
                        placeholder="0"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">월 평균 출퇴근 비용</label>
                        <input 
                          type="number" 
                          value={current.commuteCost}
                          onChange={e => setCurrent({...current, commuteCost: e.target.value})}
                          className="w-full text-xl font-black text-slate-900 border-b border-slate-100 focus:border-blue-600 outline-none pb-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">편도 통근 시간(분)</label>
                        <input 
                          type="number" 
                          value={current.commuteMin}
                          onChange={e => setCurrent({...current, commuteMin: e.target.value})}
                          className="w-full text-xl font-black text-slate-900 border-b border-slate-100 focus:border-blue-600 outline-none pb-1"
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
                  <span className="text-indigo-600">제안받은 조건</span>은 <br/>어떤가요?
                </h2>
                <p className="text-slate-500 font-medium">새로운 시작을 위한 조건을 입력해 주세요.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block">제안받은 세전 연봉 (원)</label>
                      <input 
                        type="number" 
                        value={target.annual}
                        onChange={e => setTarget({...target, annual: e.target.value})}
                        className="w-full text-4xl font-black text-indigo-600 bg-transparent border-b-2 border-slate-100 focus:border-indigo-600 outline-none pb-2 transition-all"
                        autoFocus
                      />
                    </div>
                    {/* Live Preview Bubble */}
                    <div className="p-4 bg-indigo-50 rounded-2xl flex items-center justify-between">
                       <span className="text-xs font-bold text-indigo-700">현재보다 세후 월</span>
                       <span className="text-lg font-black text-indigo-700">+{netDiff.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Detailed Logic & Tooltips */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  마지막으로 <span className="text-emerald-600">디테일</span>을 <br/>조정해 볼까요?
                </h2>
                <p className="text-slate-500 font-medium">정밀한 분석을 위해 필요한 정보입니다.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-black text-slate-400 uppercase">비과세 식대 (월)</label>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">세금 절약 효과</span>
                      </div>
                      <input type="range" min="0" max="300000" step="50000" value={nonTaxable} onChange={e=>setNonTaxable(e.target.value)} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                      <div className="flex justify-between mt-2 font-black text-slate-800">
                        <span>0원</span>
                        <span>{Number(nonTaxable).toLocaleString()}원</span>
                      </div>
                   </div>

                   <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                      <span className="text-2xl">💡</span>
                      <p className="text-xs font-medium text-amber-900 leading-relaxed">
                        **통상임금 팁**: 식대가 비과세(최대 20만 원)로 설정되면 4대 보험과 소득세 산정 기반이 낮아져 실제 실수령액이 소폭 증가합니다.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Summary Card */}
          {step === 4 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
               <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-blue-600 text-white rounded-full text-4xl mb-2">🏆</div>
                  <h2 className="text-3xl font-black text-slate-900">분석이 완료되었습니다!</h2>
               </div>

               <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-6">
                     <div>
                        <h3 className="text-white/50 font-bold text-xs uppercase tracking-widest mb-1">최종 경제적 가치 리포트</h3>
                        <div className="flex items-baseline gap-2">
                           <span className="text-6xl font-black tracking-tighter">
                             {targetStats.totalValue - currentStats.totalValue >= 0 ? '+' : ''}
                             {Math.round(targetStats.totalValue - currentStats.totalValue).toLocaleString()}
                           </span>
                           <span className="text-xl font-bold text-white/50">원 / 월</span>
                        </div>
                     </div>
                     
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-sm font-medium leading-relaxed text-white/80">
                           "이직 시 월 실수령액은 <span className="text-blue-400 font-bold">{netDiff.toLocaleString()}원</span> 늘어나지만, 
                           늘어난 통근 시간의 기회비용(<span className="text-rose-400">-{Math.round(targetStats.timeValue - currentStats.timeValue).toLocaleString()}원</span>)을 
                           따져보면 실질적인 가치는 위 금액만큼 변화합니다."
                        </p>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    이미지로 저장
                  </button>
                  <button onClick={() => setStep(1)} className="py-4 bg-slate-200 rounded-2xl font-black text-slate-800 hover:bg-slate-300 transition-all">
                    처음부터 다시
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
              className={`px-6 py-3 font-bold text-slate-400 hover:text-slate-900 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              이전 단계
            </button>
            <button 
              onClick={nextStep}
              className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all transform active:scale-95"
            >
              {step === 3 ? '최종 분석 결과 확인' : '다음으로'}
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
