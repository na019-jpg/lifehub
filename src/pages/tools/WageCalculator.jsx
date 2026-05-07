import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function WageCalculator() {
  const [baseSalary, setBaseSalary] = useState(3000000);
  const [fixedAllowances, setFixedAllowances] = useState(0);
  const [workingHours, setWorkingHours] = useState(209);
  const [overtime, setOvertime] = useState(0);
  const [nightShift, setNightShift] = useState(0);
  const [holiday, setHoliday] = useState(0);
  
  const [result, setResult] = useState(null);

  const calculateWage = () => {
    const totalOrdinary = Number(baseSalary) + Number(fixedAllowances);
    const hourlyWage = totalOrdinary / Number(workingHours);
    
    const overtimePay = Number(overtime) * hourlyWage * 1.5;
    const nightPay = Number(nightShift) * hourlyWage * 0.5;
    
    // 휴일 근로: 8시간 이내 1.5배, 초과분 2.0배
    let holidayPay = 0;
    const holidayHours = Number(holiday);
    if (holidayHours <= 8) {
      holidayPay = holidayHours * hourlyWage * 1.5;
    } else {
      holidayPay = (8 * hourlyWage * 1.5) + ((holidayHours - 8) * hourlyWage * 2.0);
    }
    
    const totalAllowances = overtimePay + nightPay + holidayPay;
    
    setResult({
      hourlyWage: Math.round(hourlyWage),
      overtimePay: Math.round(overtimePay),
      nightPay: Math.round(nightPay),
      holidayPay: Math.round(holidayPay),
      totalAllowances: Math.round(totalAllowances),
      totalPay: Math.round(totalOrdinary + totalAllowances)
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="통상임금 및 수당 계산기 - Smart Utility Hub" 
        description="기본급과 수당을 기반으로 연장, 야간, 휴일 수당을 정확하게 계산해 드립니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/" className="text-blue-600 font-bold flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-black text-slate-900">💰 통상임금 및 수당 계산기</h1>
          <p className="text-slate-500 font-medium mt-2">나의 실제 시급과 각종 가산 수당을 법적 기준에 맞춰 계산합니다.</p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <section>
              <h2 className="text-sm font-black text-blue-600 mb-4 uppercase tracking-wider">기본 급여 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">월 기본급 (원)</label>
                  <input 
                    type="number" 
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">고정 수당 (직책, 기술 등)</label>
                  <input 
                    type="number" 
                    value={fixedAllowances}
                    onChange={(e) => setFixedAllowances(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">월 소정근로시간 (기본 209)</label>
                  <input 
                    type="number" 
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-rose-600 mb-4 uppercase tracking-wider">추가 근무 시간 (월 합계)</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">연장 (h)</label>
                  <input 
                    type="number" 
                    value={overtime}
                    onChange={(e) => setOvertime(e.target.value)}
                    className="w-full px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl outline-none focus:border-rose-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">야간 (h)</label>
                  <input 
                    type="number" 
                    value={nightShift}
                    onChange={(e) => setNightShift(e.target.value)}
                    className="w-full px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">휴일 (h)</label>
                  <input 
                    type="number" 
                    value={holiday}
                    onChange={(e) => setHoliday(e.target.value)}
                    className="w-full px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl outline-none focus:border-amber-500 transition-all font-bold"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">* 야간수당은 22:00~06:00 사이 근무 시 가산됩니다.</p>
            </section>

            <button 
              onClick={calculateWage}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]"
            >
              수당 계산하기
            </button>
          </div>

          {/* Result Panel */}
          <div className="flex flex-col gap-4">
            {result ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-fade-in flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800">계산 결과</h2>
                  <div className="bg-blue-50 px-3 py-1 rounded-lg text-blue-600 font-black text-sm">
                    통상시급: {result.hourlyWage.toLocaleString()}원
                  </div>
                </div>

                <div className="space-y-6 flex-grow">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-bold">연장 수당 (1.5x)</span>
                    <span className="text-lg font-black text-slate-800">{result.overtimePay.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-bold">야간 가산 (0.5x)</span>
                    <span className="text-lg font-black text-slate-800">{result.nightPay.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-bold">휴일 수당 (1.5x~)</span>
                    <span className="text-lg font-black text-slate-800">{result.holidayPay.toLocaleString()}원</span>
                  </div>
                  
                  <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 font-bold text-sm">수당 합계</span>
                      <span className="text-xl font-black text-rose-400">+{result.totalAllowances.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4">
                      <span className="text-white font-black">월 총 지급액(전)</span>
                      <span className="text-4xl font-black text-blue-400">{result.totalPay.toLocaleString()}<span className="text-lg ml-1">원</span></span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-slate-50 rounded-xl text-[12px] leading-relaxed text-slate-500 border border-slate-200">
                   📍 **노무사 팁**: 5인 미만 사업장의 경우 연장/야간/휴일 가산 수당(1.5배) 의무가 적용되지 않아 1.0배로 계산될 수 있습니다. 위 계산은 5인 이상 사업장 기준입니다.
                </div>
              </div>
            ) : (
              <div className="bg-slate-200 p-8 rounded-3xl text-slate-400 flex flex-col items-center justify-center text-center flex-grow border-2 border-dashed border-slate-300">
                <span className="text-5xl mb-4 opacity-50">⚖️</span>
                <p className="font-bold text-lg">왼쪽에 급여 및 근무 정보를<br/>입력하시면 결과를 확인할 수 있습니다.</p>
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
