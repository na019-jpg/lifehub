import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function VacationCalculator() {
  const [joinDate, setJoinDate] = useState('');
  const [usedDays, setUsedDays] = useState(0);
  const [result, setResult] = useState(null);

  const calculateVacation = () => {
    if (!joinDate) return;
    
    const today = new Date();
    const join = new Date(joinDate);
    
    // 연차 계산 로직 (근로기준법 기준 간소화)
    // 1년 미만: 1개월 개근 시 1일 (최대 11일)
    // 1년 이상: 15일 (2년마다 1일 추가, 최대 25일)
    
    const diffTime = Math.abs(today - join);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    
    let totalDays = 0;
    if (diffYears < 1) {
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44));
      totalDays = Math.min(diffMonths, 11);
    } else {
      totalDays = 15 + Math.floor((diffYears - 1) / 2);
      totalDays = Math.min(totalDays, 25);
    }
    
    setResult({
      totalDays,
      remainingDays: Math.max(totalDays - usedDays, 0),
      yearsOfService: diffYears
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="연차/휴가 계산기 - Smart Utility Hub" 
        description="입사일 기준 현재 사용 가능한 연차 개수와 미사용 연차 수당을 계산해 드립니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/" className="text-blue-600 font-bold flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-black text-slate-900">📅 연차/휴가 계산기</h1>
          <p className="text-slate-500 font-medium mt-2">근로기준법 기준으로 나의 소중한 연차를 정확히 관리하세요.</p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">정보 입력</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">입사일 선택</label>
                <input 
                  type="date" 
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">올해 사용한 연차 (일)</label>
                <input 
                  type="number" 
                  value={usedDays}
                  onChange={(e) => setUsedDays(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="0"
                />
              </div>

              <button 
                onClick={calculateVacation}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-all"
              >
                계산하기
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {result ? (
              <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl animate-fade-in flex-grow">
                <h2 className="text-xl font-bold mb-6 opacity-90">계산 결과</h2>
                
                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-blue-400 pb-4">
                    <span className="text-blue-100 font-medium">총 발생 연차</span>
                    <span className="text-3xl font-black">{result.totalDays} <span className="text-lg">일</span></span>
                  </div>
                  
                  <div className="flex justify-between items-end border-b border-blue-400 pb-4">
                    <span className="text-blue-100 font-medium">사용한 연차</span>
                    <span className="text-3xl font-black">{usedDays} <span className="text-lg">일</span></span>
                  </div>

                  <div className="flex justify-between items-end bg-blue-500 p-6 rounded-2xl">
                    <span className="text-white font-black text-lg">남은 연차</span>
                    <span className="text-5xl font-black tracking-tight">{result.remainingDays} <span className="text-2xl">일</span></span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-700/30 rounded-xl text-sm leading-relaxed text-blue-50">
                  💡 {result.yearsOfService}년차 근로자이시군요! <br/>
                  미사용 연차는 회사 규정에 따라 수당으로 청구하거나 이월할 수 있으니 꼭 확인하세요.
                </div>
              </div>
            ) : (
              <div className="bg-slate-200 p-8 rounded-3xl text-slate-400 flex flex-col items-center justify-center text-center flex-grow border-2 border-dashed border-slate-300">
                <span className="text-5xl mb-4 opacity-50">📊</span>
                <p className="font-bold text-lg">왼쪽에 정보를 입력하시면<br/>결과를 바로 확인할 수 있습니다.</p>
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
