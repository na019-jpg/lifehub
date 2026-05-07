import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function WageCalculator() {
  const [baseSalary, setBaseSalary] = useState(3000000);
  const [fixedAllowances, setFixedAllowances] = useState(0);
  const [workingHours, setWorkingHours] = useState(209);
  const [isSmallBusiness, setIsSmallBusiness] = useState(false); // 5인 미만 여부
  
  const [overtime, setOvertime] = useState(0);
  const [nightShift, setNightShift] = useState(0);
  const [holiday, setHoliday] = useState(0);
  
  const [result, setResult] = useState(null);

  const calculateNet = (gross) => {
    // 간소화된 4대보험 및 소득세 계산 (2026 기준 추정치)
    const pension = Math.min(gross * 0.045, 265500);
    const health = gross * 0.03545;
    const longTerm = health * 0.1295;
    const employment = gross * 0.009;
    const incomeTax = gross > 2000000 ? gross * 0.05 : 0; // 초간단 모형
    return Math.round(gross - (pension + health + longTerm + employment + incomeTax * 1.1));
  };

  const calculateWage = () => {
    const totalOrdinary = Number(baseSalary) + Number(fixedAllowances);
    const hourlyWage = totalOrdinary / Number(workingHours);
    
    // 가산율 결정 (5인 미만은 1.0배, 이상은 1.5배 등)
    const multiplier = isSmallBusiness ? 1.0 : 1.5;
    const nightMultiplier = isSmallBusiness ? 0 : 0.5;
    
    const overtimePay = Number(overtime) * hourlyWage * multiplier;
    const nightPay = Number(nightShift) * hourlyWage * nightMultiplier;
    
    let holidayPay = 0;
    const hHours = Number(holiday);
    if (isSmallBusiness) {
      holidayPay = hHours * hourlyWage;
    } else {
      if (hHours <= 8) {
        holidayPay = hHours * hourlyWage * 1.5;
      } else {
        holidayPay = (8 * hourlyWage * 1.5) + ((hHours - 8) * hourlyWage * 2.0);
      }
    }
    
    const totalAllowances = overtimePay + nightPay + holidayPay;
    const grossTotal = totalOrdinary + totalAllowances;
    
    setResult({
      hourlyWage: Math.round(hourlyWage),
      overtimePay: Math.round(overtimePay),
      nightPay: Math.round(nightPay),
      holidayPay: Math.round(holidayPay),
      totalAllowances: Math.round(totalAllowances),
      grossTotal: Math.round(grossTotal),
      netTotal: calculateNet(grossTotal)
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="전문가용 통상임금 계산기 - Smart Utility Hub" 
        description="5인 미만 사업장 여부 및 세전/세후 금액을 동시에 확인하는 정밀 수당 계산기입니다."
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
             <span className="text-3xl">💰</span>
             <div>
                <h1 className="text-2xl font-black text-slate-900">전문가용 통상임금 계산기</h1>
                <p className="text-slate-500 font-medium text-sm">사업장 규모별 가산수당 및 실수령액 자동 산출</p>
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <section>
              <label className="block text-sm font-bold text-slate-600 mb-3">사업장 규모</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button 
                  onClick={() => setIsSmallBusiness(false)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${!isSmallBusiness ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  5인 이상 (가산 1.5배)
                </button>
                <button 
                  onClick={() => setIsSmallBusiness(true)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${isSmallBusiness ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                >
                  5인 미만 (가산 없음)
                </button>
              </div>
            </section>

            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">월 기본급</label>
                    <input type="number" value={baseSalary} onChange={e=>setBaseSalary(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">고정 수당</label>
                    <input type="number" value={fixedAllowances} onChange={e=>setFixedAllowances(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-bold" />
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">연장(h)</label>
                    <input type="number" value={overtime} onChange={e=>setOvertime(e.target.value)} className="w-full px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl outline-none focus:border-rose-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">야간(h)</label>
                    <input type="number" value={nightShift} onChange={e=>setNightShift(e.target.value)} className="w-full px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl outline-none focus:border-indigo-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">휴일(h)</label>
                    <input type="number" value={holiday} onChange={e=>setHoliday(e.target.value)} className="w-full px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl outline-none focus:border-amber-500 font-bold" />
                  </div>
               </div>
            </div>

            <button onClick={calculateWage} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]">결과 확인</button>
          </div>

          <div className="flex flex-col gap-4">
            {result ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-fade-in space-y-6">
                <div className="flex justify-between items-end border-b pb-4">
                   <h2 className="text-xl font-black text-slate-800">계산 결과 리포트</h2>
                   <span className="text-blue-600 font-bold">시급: {result.hourlyWage.toLocaleString()}원</span>
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">수당 합계 (가산 포함)</span>
                      <span className="font-bold">+{result.totalAllowances.toLocaleString()}원</span>
                   </div>
                   <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-2xl">
                      <div className="flex justify-between items-center mb-4 opacity-70">
                         <span className="font-bold">세전 총급여</span>
                         <span className="text-xl font-black">{result.grossTotal.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between items-end border-t border-white/10 pt-4">
                         <span className="font-black text-blue-400">월 예상 실수령액</span>
                         <span className="text-4xl font-black">{result.netTotal.toLocaleString()}<span className="text-lg ml-1">원</span></span>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl text-[11px] leading-relaxed text-amber-800 border border-amber-100">
                   💡 {isSmallBusiness ? '5인 미만 사업장은 근로기준법상 가산수당(1.5배) 지급 의무가 없습니다.' : '5인 이상 사업장은 연장/야간/휴일 근무 시 법정 가산율이 적용됩니다.'}
                </div>
              </div>
            ) : (
              <div className="bg-slate-200 p-8 rounded-3xl text-slate-400 flex flex-col items-center justify-center text-center flex-grow border-2 border-dashed border-slate-300">
                <span className="text-5xl mb-4 opacity-50">⚖️</span>
                <p className="font-bold text-lg">사업장 규모와 급여를 입력하시면<br/>실수령액까지 한 번에 산출합니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}
