import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function VacationCalculator() {
  const [joinDate, setJoinDate] = useState('');
  const [calcMode, setCalcMode] = useState('join');
  const [usedDays, setUsedDays] = useState(0);
  const [leaveType, setLeaveType] = useState('none'); // none, parental, personal
  const [leaveDays, setLeaveDays] = useState(0);
  
  const [result, setResult] = useState(null);

  const calculateVacation = () => {
    if (!joinDate) return;
    
    const today = new Date();
    const join = new Date(joinDate);
    const diffTime = today - join;
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    
    let totalDays = 0;
    let description = "";

    if (calcMode === 'join') {
      if (diffYears < 1) {
        const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
        totalDays = Math.min(diffMonths, 11);
        description = "입사 1년 미만은 1개월 개근 시 1일씩 발생합니다.";
      } else {
        totalDays = 15 + Math.floor((diffYears - 1) / 2);
        totalDays = Math.min(totalDays, 25);
        
        // 개인 휴직에 따른 비례 삭감
        if (leaveType === 'personal' && leaveDays > 0) {
          const deduction = Math.round(totalDays * (leaveDays / 365));
          totalDays -= deduction;
          description = `개인 휴직(${leaveDays}일)으로 인해 연차가 ${deduction}일 비례 삭감되었습니다.`;
        } else {
          description = `${diffYears + 1}년차 정기 연차와 근속 가산이 합산되었습니다.`;
        }
      }
    } else {
      // 회계연도 기준
      if (diffYears < 1) {
        const joinMonth = join.getMonth() + 1;
        const prorated = Math.round(15 * (13 - joinMonth) / 12);
        totalDays = prorated;
        description = "첫 해 비례 연차 계산 결과입니다.";
      } else {
        totalDays = 15 + Math.floor((diffYears - 1) / 2);
        totalDays = Math.min(totalDays, 25);
        description = "회계연도(1/1) 기준 연차입니다.";
      }
    }
    
    setResult({
      totalDays,
      remainingDays: Math.max(totalDays - usedDays, 0),
      yearsOfService: diffYears,
      description
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SeoHelmet 
        title="스마트 연차 마스터 | LifeHub" 
        description="복잡한 입사일/회계연도 기준과 휴직에 따른 비례 연차를 완벽하게 계산해 드립니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-8">
        <div className="container mx-auto max-w-5xl px-4 flex justify-between items-center">
          <div>
            <Link to="/" className="text-blue-600 font-bold text-sm mb-1 block">← 홈으로 돌아가기</Link>
            <h1 className="text-3xl font-black text-slate-900">📅 스마트 연차 마스터</h1>
          </div>
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black border border-indigo-100">
             2026 개정법률 준수
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
               <h2 className="text-lg font-black text-slate-800">1. 기본 근로 정보</h2>
               
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">계산 기준</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                    <button onClick={()=>setCalcMode('join')} className={`py-3 rounded-xl font-black text-xs transition-all ${calcMode === 'join' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>입사일 기준</button>
                    <button onClick={()=>setCalcMode('accounting')} className={`py-3 rounded-xl font-black text-xs transition-all ${calcMode === 'accounting' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>회계연도 기준</button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">입사일</label>
                    <input type="date" value={joinDate} onChange={e=>setJoinDate(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl font-black focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">사용한 연차 (일)</label>
                    <input type="number" value={usedDays} onChange={e=>setUsedDays(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl font-black focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
               <h2 className="text-lg font-black text-slate-800">2. 휴직 및 예외 사항</h2>
               
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">휴직 유형</label>
                  <div className="flex gap-2">
                    {['none', 'parental', 'personal'].map(type => (
                      <button 
                        key={type}
                        onClick={()=>setLeaveType(type)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition-all ${leaveType === type ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-100 text-slate-300'}`}
                      >
                        {type === 'none' ? '없음' : type === 'parental' ? '법정 휴직' : '개인 휴직'}
                      </button>
                    ))}
                  </div>
               </div>

               {leaveType !== 'none' && (
                 <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">휴직 일수</label>
                    <input 
                      type="number" 
                      value={leaveDays} 
                      onChange={e=>setLeaveDays(e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border-0 rounded-2xl font-black focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="휴직 기간을 입력하세요"
                    />
                    <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
                      * 법정 휴직(육아휴직 등)은 연차 발생 시 출근으로 간주되지만, 개인 휴직은 비례하여 삭감될 수 있습니다.
                    </p>
                 </div>
               )}
            </div>

            <button 
              onClick={calculateVacation}
              className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-xl hover:bg-black transition-all transform hover:scale-[1.01]"
            >
              연차 정밀 분석 리포트 생성
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                 <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                    <h3 className="text-indigo-100 font-black text-sm uppercase tracking-widest mb-2">잔여 연차 분석</h3>
                    <div className="flex items-baseline gap-2 mb-8">
                       <span className="text-7xl font-black tracking-tighter">{result.remainingDays}</span>
                       <span className="text-2xl font-bold">일</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                          <span className="text-[10px] font-black opacity-60 uppercase block mb-1">총 발생 연차</span>
                          <span className="text-lg font-black">{result.totalDays}일</span>
                       </div>
                       <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                          <span className="text-[10px] font-black opacity-60 uppercase block mb-1">사용한 연차</span>
                          <span className="text-lg font-black">{usedDays}일</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-4">🗓️ 상세 가이드</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                       {result.description}
                    </p>
                    
                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                       <h5 className="text-blue-700 font-black text-xs mb-2">전문가 팁</h5>
                       <p className="text-blue-600/80 text-[11px] leading-relaxed">
                          연차는 발생일로부터 1년 이내에 사용하지 않으면 소멸됩니다. 퇴사 시 미사용 연차는 '연차수당'으로 정산받을 수 있으니 꼼꼼히 챙기세요!
                       </p>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="bg-slate-200 h-full min-h-[500px] rounded-[40px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                 <div className="text-6xl mb-6">🏝️</div>
                 <h3 className="text-xl font-black text-slate-700 mb-2">당신의 휴식, 정당한 권리</h3>
                 <p className="text-sm font-medium leading-relaxed max-w-xs">
                    복잡한 입사일과 휴직 규정 때문에 <br/>
                    헷갈렸던 내 연차를 법적 기준에 맞춰 <br/>
                    정확하게 계산해 드립니다.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
