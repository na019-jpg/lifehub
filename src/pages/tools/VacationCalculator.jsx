import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function VacationCalculator() {
  const [step, setStep] = useState(1);
  const [joinDate, setJoinDate] = useState('');
  const [calcMode, setCalcMode] = useState('join');
  const [usedDays, setUsedDays] = useState(0);
  const [leaveType, setLeaveType] = useState('none');
  const [leaveDays, setLeaveDays] = useState(0);

  const result = useMemo(() => {
    if (!joinDate) return null;
    const today = new Date();
    const join = new Date(joinDate);
    const diffTime = today - join;
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    
    let total = 0;
    if (calcMode === 'join') {
      if (diffYears < 1) {
        total = Math.min(Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)), 11);
      } else {
        total = 15 + Math.floor((diffYears - 1) / 2);
        if (leaveType === 'personal') total -= Math.round(total * (Number(leaveDays) / 365));
      }
    } else {
      if (diffYears < 1) total = Math.round(15 * (13 - (join.getMonth() + 1)) / 12);
      else total = 15 + Math.floor((diffYears - 1) / 2);
    }
    return { total: Math.min(total, 25), remaining: Math.max(total - Number(usedDays), 0), years: diffYears };
  }, [joinDate, calcMode, usedDays, leaveType, leaveDays]);

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans overflow-x-hidden">
      <SeoHelmet title="스마트 연차 계산기 | LifeHub" description="대화형 인터페이스로 내 연차를 정확하게 관리하세요." />
      
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-50">
        <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
      </div>

      <header className="bg-white border-b border-slate-100 py-6 sticky top-1.5 z-40">
        <div className="container mx-auto max-w-2xl px-6 flex justify-between items-center">
          <Link to="/" className="text-slate-400 hover:text-slate-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VACATION · STEP {step}</span>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="min-h-[500px]">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                   반가워요! <br/><span className="text-emerald-600">입사일</span>이 언제인가요?
                 </h2>
                 <p className="text-slate-500 font-medium">정확한 법적 연차 발생일을 계산해 드립니다.</p>
               </div>

               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">입사 날짜</label>
                    <input type="date" value={joinDate} onChange={e=>setJoinDate(e.target.value)} className="w-full text-3xl font-black text-slate-900 border-b-2 border-slate-100 focus:border-emerald-600 outline-none pb-2 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-4 block">회사의 연차 관리 기준은?</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={()=>setCalcMode('join')} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${calcMode === 'join' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>입사일 기준</button>
                       <button onClick={()=>setCalcMode('accounting')} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${calcMode === 'accounting' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>회계연도 기준</button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                   혹시 <span className="text-emerald-600">휴직</span>이나 <br/>이미 <span className="text-blue-600">사용한 연차</span>가 있나요?
                 </h2>
                 <p className="text-slate-500 font-medium">예외 상황을 반영하여 잔여 연차를 확정합니다.</p>
               </div>

               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                  <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block">올해 사용한 연차 (일)</label>
                      <input type="number" value={usedDays} onChange={e=>setUsedDays(e.target.value)} className="w-full text-2xl font-black text-slate-900 border-b border-slate-100 focus:border-blue-600 outline-none pb-1 transition-all" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-4 block">휴직 여부</label>
                    <div className="flex gap-2">
                       {['none', 'parental', 'personal'].map(t => (
                         <button key={t} onClick={()=>setLeaveType(t)} className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${leaveType === t ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-300'}`}>
                           {t === 'none' ? '없음' : t === 'parental' ? '법정 휴직' : '개인 휴직'}
                         </button>
                       ))}
                    </div>
                  </div>

                  {leaveType !== 'none' && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                       <label className="text-xs font-black text-slate-400 uppercase mb-2 block">휴직 기간 (일)</label>
                       <input type="number" value={leaveDays} onChange={e=>setLeaveDays(e.target.value)} className="w-full text-xl font-black text-slate-900 border-b border-slate-100 focus:border-emerald-600 outline-none pb-1" placeholder="0" />
                    </div>
                  )}
               </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="text-center">
                  <span className="text-5xl mb-4 block">🏝️</span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">당신의 연차 리포트</h2>
               </div>

               <div className="bg-emerald-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                  <h3 className="font-black text-xs uppercase tracking-widest mb-2 opacity-70">Remaining Vacation</h3>
                  <div className="text-7xl font-black tracking-tighter mb-8 leading-none">
                     {result.remaining}일
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-black opacity-60 block mb-1 uppercase">총 발생 연차</span>
                        <span className="text-xl font-black">{result.total}일</span>
                     </div>
                     <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-black opacity-60 block mb-1 uppercase">근속 연수</span>
                        <span className="text-xl font-black">{result.years}년차</span>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               </div>

               <div className="p-6 bg-white border border-slate-200 rounded-3xl">
                  <h4 className="font-black text-slate-800 mb-2">🗓️ 관리 팁</h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                     {calcMode === 'join' ? '입사일 기준으로 관리되고 있습니다. ' : '회계연도 기준으로 관리되고 있습니다. '}
                     {result.remaining > 5 ? '연차가 넉넉히 남았네요! 여유 있는 휴가를 계획해 보세요.' : '연차가 얼마 남지 않았습니다. 소중하게 사용하세요!'}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-800 hover:bg-slate-50 transition-all">스케줄 저장</button>
                  <button onClick={()=>setStep(1)} className="py-4 bg-slate-200 rounded-2xl font-black text-slate-800 hover:bg-slate-300 transition-all">다시 계산</button>
               </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="mt-12 flex items-center justify-between">
            <button onClick={prevStep} className={`px-6 py-3 font-bold text-slate-400 hover:text-slate-900 transition-all ${step === 1 ? 'invisible' : ''}`}>이전 단계</button>
            <button onClick={() => setStep(s => s + 1)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all transform active:scale-95">
               {step === 2 ? '최종 리포트 생성' : '다음으로'}
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
