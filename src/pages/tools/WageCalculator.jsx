import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function WageCalculator() {
  const [baseSalary, setBaseSalary] = useState(3000000);
  const [allowances, setAllowances] = useState([
    { id: 1, name: '직책수당', amount: 200000, isOrdinary: true },
    { id: 2, name: '기술수당', amount: 100000, isOrdinary: true },
    { id: 3, name: '식대', amount: 200000, isOrdinary: false }
  ]);
  
  const [workingHours, setWorkingHours] = useState(209);
  const [isSmallBusiness, setIsSmallBusiness] = useState(false);
  const [actualOvertime, setActualOvertime] = useState(0);
  const [actualNight, setActualNight] = useState(0);
  const [actualHoliday, setActualHoliday] = useState(0);
  
  const [receivedOvertime, setReceivedOvertime] = useState(0); // 명세서상 받은 수당
  const [result, setResult] = useState(null);

  const addAllowance = () => {
    setAllowances([...allowances, { id: Date.now(), name: '', amount: 0, isOrdinary: false }]);
  };

  const removeAllowance = (id) => {
    setAllowances(allowances.filter(a => a.id !== id));
  };

  const calculateWageAudit = () => {
    const totalOrdinary = Number(baseSalary) + allowances
      .filter(a => a.isOrdinary)
      .reduce((sum, a) => sum + Number(a.amount), 0);
    
    const hourlyWage = totalOrdinary / Number(workingHours);
    const multiplier = isSmallBusiness ? 1.0 : 1.5;
    const nightMultiplier = isSmallBusiness ? 0 : 0.5;
    
    const shouldOvertime = Number(actualOvertime) * hourlyWage * multiplier;
    const shouldNight = Number(actualNight) * hourlyWage * nightMultiplier;
    
    let shouldHoliday = 0;
    const h = Number(actualHoliday);
    if (isSmallBusiness) {
      shouldHoliday = h * hourlyWage;
    } else {
      shouldHoliday = h <= 8 ? h * hourlyWage * 1.5 : (8 * hourlyWage * 1.5) + ((h - 8) * hourlyWage * 2.0);
    }
    
    const totalShould = shouldOvertime + shouldNight + shouldHoliday;
    const difference = totalShould - Number(receivedOvertime);
    
    setResult({
      hourlyWage: Math.round(hourlyWage),
      totalShould: Math.round(totalShould),
      difference: Math.round(difference),
      isUnderpaid: difference > 100 // 100원 이상 차이날 때
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SeoHelmet 
        title="임금 체불 및 수당 감사 계산기 | LifeHub" 
        description="내 수당이 제대로 계산되었는지 법적 기준(정기성/일률성/고정성)에 맞춰 정밀하게 진단합니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-8">
        <div className="container mx-auto max-w-5xl px-4 flex justify-between items-center">
          <div>
            <Link to="/" className="text-blue-600 font-bold text-sm mb-1 block">← 홈으로 돌아가기</Link>
            <h1 className="text-3xl font-black text-slate-900">⚖️ 임금 및 수당 정밀 감사</h1>
          </div>
          <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-xs font-black border border-rose-100">
            주휴수당 포함(209h) 기준
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs Section */}
          <div className="lg:col-span-7 space-y-8">
            {/* Base Info */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-black text-slate-800">1. 급여 및 수당 항목</h2>
                 <button onClick={addAllowance} className="text-blue-600 font-bold text-xs hover:underline">+ 항목 추가</button>
               </div>
               
               <div className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">기본급</label>
                      <input type="number" value={baseSalary} onChange={e=>setBaseSalary(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl font-black focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div className="w-24 p-3 text-center text-[10px] font-black text-slate-400 bg-slate-100 rounded-xl">통상임금 고정</div>
                  </div>

                  {allowances.map((a, idx) => (
                    <div key={a.id} className="flex gap-3 items-end group">
                       <div className="flex-grow">
                         <input 
                           placeholder="수당명" 
                           value={a.name} 
                           onChange={e => {
                             const newArr = [...allowances];
                             newArr[idx].name = e.target.value;
                             setAllowances(newArr);
                           }}
                           className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                         />
                       </div>
                       <div className="w-32">
                         <input 
                           type="number" 
                           placeholder="금액" 
                           value={a.amount} 
                           onChange={e => {
                             const newArr = [...allowances];
                             newArr[idx].amount = e.target.value;
                             setAllowances(newArr);
                           }}
                           className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                         />
                       </div>
                       <button 
                         onClick={() => {
                           const newArr = [...allowances];
                           newArr[idx].isOrdinary = !newArr[idx].isOrdinary;
                           setAllowances(newArr);
                         }}
                         className={`px-3 py-3 rounded-xl text-[10px] font-black border-2 transition-all ${a.isOrdinary ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-100 text-slate-300'}`}
                       >
                         {a.isOrdinary ? '통상 포함' : '포함 제외'}
                       </button>
                       <button onClick={() => removeAllowance(a.id)} className="p-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">×</button>
                    </div>
                  ))}
               </div>
               <p className="mt-4 text-[10px] text-slate-400 leading-relaxed italic">
                 * 정기성, 일률성, 고정성을 갖춘 수당만 '통상 포함'을 선택하세요. 식대, 명절상여금 등은 고정성 여부에 따라 달라질 수 있습니다.
               </p>
            </div>

            {/* Hours Info */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
               <h2 className="text-lg font-black text-slate-800 mb-6">2. 실제 근로 시간 및 지급액</h2>
               <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">연장(h)</label>
                    <input type="number" value={actualOvertime} onChange={e=>setActualOvertime(e.target.value)} className="w-full px-4 py-3 bg-rose-50 border-0 rounded-xl font-black text-rose-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">야간(h)</label>
                    <input type="number" value={actualNight} onChange={e=>setActualNight(e.target.value)} className="w-full px-4 py-3 bg-indigo-50 border-0 rounded-xl font-black text-indigo-700" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">휴일(h)</label>
                    <input type="number" value={actualHoliday} onChange={e=>setActualHoliday(e.target.value)} className="w-full px-4 py-3 bg-amber-50 border-0 rounded-xl font-black text-amber-700" />
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">급여 명세서상 총 수당 합계 (가산수당 부분)</label>
                  <input 
                    type="number" 
                    value={receivedOvertime} 
                    onChange={e=>setReceivedOvertime(e.target.value)} 
                    placeholder="실제로 받은 금액을 입력하세요"
                    className="w-full px-5 py-4 bg-slate-900 text-white border-0 rounded-2xl font-black placeholder:text-white/20" 
                  />
               </div>
            </div>
            
            <button 
              onClick={calculateWageAudit}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-xl transition-all transform hover:scale-[1.01]"
            >
              임금 정밀 감사 결과 보기
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                 <div className={`p-10 rounded-[40px] shadow-2xl ${result.isUnderpaid ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    <h3 className="text-white/70 font-black text-sm uppercase tracking-widest mb-2">감사 결과 리포트</h3>
                    <div className="flex items-baseline gap-2 mb-6">
                       <span className="text-6xl font-black tracking-tighter">
                          {result.isUnderpaid ? '과소 지급' : '적정 지급'}
                       </span>
                    </div>
                    
                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm opacity-80">법정 기준 수당</span>
                          <span className="font-black text-lg">{result.totalShould.toLocaleString()}원</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="font-bold text-sm opacity-80">실제 지급 수당</span>
                          <span className="font-black text-lg">{Number(receivedOvertime).toLocaleString()}원</span>
                       </div>
                       <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-end">
                          <span className="font-black">미지급 차액</span>
                          <span className={`text-3xl font-black ${result.isUnderpaid ? 'text-rose-200' : 'text-emerald-200'}`}>
                             {result.isUnderpaid ? `+${result.difference.toLocaleString()}` : '0'}원
                          </span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-4">📍 노무사 코멘트</h4>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                       {result.isUnderpaid 
                        ? `법정 기준보다 약 ${result.difference.toLocaleString()}원이 적게 지급되었습니다. 입력하신 수당 중 '통상임금'에 포함되어야 할 항목이 누락되었거나 가산율이 잘못 적용되었을 수 있습니다.` 
                        : `현재 지급된 수당은 법정 기준을 상회하거나 적정하게 계산되었습니다. 통상임금 산정 범위와 가산율이 올바르게 반영된 것으로 보입니다.`}
                    </p>
                 </div>
                 
                 <div className="p-6 bg-slate-100 rounded-3xl text-[11px] text-slate-400 leading-relaxed">
                    본 계산 결과는 사용자가 입력한 정보를 바탕으로 근로기준법을 적용한 시뮬레이션입니다. 실제 법적 효력을 갖기 위해서는 근로계약서 전문과 취업규칙에 대한 노무사의 정밀 검토가 필요합니다.
                 </div>
              </div>
            ) : (
              <div className="bg-slate-200 h-full min-h-[500px] rounded-[40px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                 <div className="text-6xl mb-6">🔍</div>
                 <h3 className="text-xl font-black text-slate-700 mb-2">명세서 속 숨은 진실</h3>
                 <p className="text-sm font-medium leading-relaxed max-w-xs">
                    급여 명세서의 수당 항목과 실제 근무 시간을 대조하여 <br/>
                    법정 기준에 맞는 정당한 임금을 계산해 드립니다.
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
