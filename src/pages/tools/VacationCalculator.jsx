import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';
import ToolTabs from '../../components/ToolTabs';

export default function VacationCalculator() {
  const [step, setStep] = useState(1);
  const [joinDate, setJoinDate] = useState('');
  const [calcMode, setCalcMode] = useState('join');
  const [usedDays, setUsedDays] = useState(0);
  const [leaveType, setLeaveType] = useState('none');
  const [leaveDays, setLeaveDays] = useState(0);

  const formatValue = (val) => Number(val).toLocaleString();

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
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans overflow-x-hidden">
      <SeoHelmet title="스마트 연차 계산기 | LifeHub Dashboard" description="게이지 차트로 남은 연차를 직관적으로 확인하세요." />
      
      <ToolTabs activeCategory="career" />

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="min-h-[500px]">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                   반가워요! <br/><span className="text-[#2E7D32]">입사일</span>이 언제인가요?
                 </h2>
                 <p className="text-slate-500 font-medium">정확한 법적 연차 발생일을 계산해 드립니다.</p>
               </div>

               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">입사 날짜</label>
                    <input type="date" value={joinDate} onChange={e=>setJoinDate(e.target.value)} className="w-full text-3xl font-black text-[#1A237E] border-b-2 border-slate-100 focus:border-[#2E7D32] outline-none pb-2 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-4 block tracking-widest">연차 관리 기준</label>
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={()=>setCalcMode('join')} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${calcMode === 'join' ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]' : 'bg-white border-slate-100 text-slate-400'}`}>입사일 기준</button>
                       <button onClick={()=>setCalcMode('accounting')} className={`py-4 rounded-2xl font-black text-sm border-2 transition-all ${calcMode === 'accounting' ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]' : 'bg-white border-slate-100 text-slate-400'}`}>회계연도 기준</button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-2">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                   혹시 <span className="text-[#2E7D32]">휴직</span>이나 <br/>이미 <span className="text-[#1A237E]">사용한 연차</span>가 있나요?
                 </h2>
                 <p className="text-slate-500 font-medium">예외 상황을 반영하여 잔여 연차를 확정합니다.</p>
               </div>

               <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                  <div className="flex-grow">
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block tracking-widest">올해 사용 연차 (일)</label>
                    <input type="number" value={usedDays} onChange={e=>setUsedDays(e.target.value)} className="w-full text-2xl font-black text-slate-900 border-b border-slate-100 focus:border-[#2E7D32] outline-none pb-1 transition-all" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-4 block tracking-widest">특이사항 (휴직)</label>
                    <div className="flex gap-2">
                       {['none', 'parental', 'personal'].map(t => (
                         <button key={t} onClick={()=>setLeaveType(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-black border-2 transition-all ${leaveType === t ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]' : 'bg-white border-slate-100 text-slate-300'}`}>
                           {t === 'none' ? '없음' : t === 'parental' ? '법정 휴직' : '개인 휴직'}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {step === 3 && result && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
               <div className="flex justify-between items-end mb-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-[#1A237E] tracking-tight">연차 현황 리포트</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Vacation Balance Insight</p>
                  </div>
                  <span className="bg-[#2E7D32]/10 text-[#2E7D32] px-3 py-1 rounded-full text-[10px] font-black uppercase">Live</span>
               </div>

               {/* Gauge Chart Card */}
               <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col items-center">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 w-full">Remaining Days Ratio</h3>
                  
                  <div className="relative w-64 h-32 flex items-center justify-center overflow-hidden mb-12">
                     <svg className="w-full h-full" viewBox="0 0 100 50">
                        {/* Background Path */}
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="10" strokeLinecap="round" />
                        {/* Progress Path */}
                        <path 
                          d="M 10 50 A 40 40 0 0 1 90 50" 
                          fill="none" 
                          stroke="#2E7D32" 
                          strokeWidth="10" 
                          strokeLinecap="round" 
                          strokeDasharray={`${(result.remaining / result.total) * 125} 125`}
                          className="transition-all duration-1000 ease-out"
                        />
                     </svg>
                     <div className="absolute bottom-0 text-center">
                        <span className="text-5xl font-black text-[#1A237E]">{formatValue(result.remaining)}</span>
                        <span className="text-sm font-bold text-slate-400 ml-1">/ {formatValue(result.total)}일</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                     <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-slate-100 text-center">
                        <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-tighter">근속 연수</span>
                        <span className="text-lg font-black text-[#1A237E]">{formatValue(result.years)}년차</span>
                     </div>
                     <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-slate-100 text-center">
                        <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-tighter">다음 가산일</span>
                        <span className="text-lg font-black text-[#2E7D32]">{result.years % 2 === 0 ? '내년' : '올해'}</span>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-white border border-slate-200 rounded-3xl">
                  <h4 className="font-black text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full"></span>
                    관리 인텔리전스
                  </h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                     {result.remaining > 5 ? '현재 연차가 넉넉히 남은 상태입니다. 연말에 소멸되기 전, 미리 휴가 계획을 세워 리프레시 시간을 가지는 것을 추천합니다.' : '잔여 연차가 5일 미만입니다. 연차 유급휴가 미사용 수당 전환 여부를 회사의 취업규칙을 통해 확인해 보세요.'}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button className="py-4 bg-[#1A237E] text-white rounded-2xl font-black text-sm shadow-xl hover:bg-[#151b66] transition-all">
                    스케줄로 저장
                  </button>
                  <button onClick={()=>setStep(1)} className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">
                    처음부터 다시
                  </button>
               </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="mt-12 flex items-center justify-between">
            <button onClick={prevStep} className={`px-6 py-3 font-bold text-slate-400 hover:text-[#1A237E] transition-all ${step === 1 ? 'invisible' : ''}`}>이전 단계</button>
            <button onClick={() => setStep(s => s + 1)} className="px-10 py-4 bg-[#1A237E] text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all transform active:scale-95">
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
