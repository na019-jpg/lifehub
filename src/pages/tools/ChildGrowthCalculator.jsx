import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function ChildGrowthCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);

  const calculateGrowth = () => {
    if (!birthDate) return;
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    const diffTime = today - birth;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30.44);
    const diffYears = Math.floor(diffMonths / 12);
    
    // 예방접종 추천 정보 (간소화)
    let vaccination = "";
    if (diffMonths <= 2) vaccination = "B형 간염(2차), DTap(1차), 폴리오(1차)";
    else if (diffMonths <= 4) vaccination = "DTap(2차), 폴리오(2차), 폐렴구균(2차)";
    else if (diffMonths <= 6) vaccination = "DTap(3차), 폴리오(3차), B형 간염(3차)";
    else if (diffMonths <= 12) vaccination = "수두(1차), MMR(1차), 일본뇌염(1차)";
    else vaccination = "정기 국가 예방접종 스케줄을 확인하세요.";
    
    setResult({
      days: diffDays,
      months: diffMonths,
      years: diffYears,
      nextVaccination: vaccination
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="아이 발달 상태 계산기 - Smart Utility Hub" 
        description="우리 아이의 현재 개월수와 맞춤형 예방접종 시기를 자동으로 알려드립니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/" className="text-blue-600 font-bold flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-black text-slate-900">👶 아이 발달 상태 계산기</h1>
          <p className="text-slate-500 font-medium mt-2">생년월일만 입력하면 개월 수와 예방접종 시기를 바로 알려드려요.</p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">아이 정보 입력</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">생년월일 선택</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <button 
                onClick={calculateGrowth}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl shadow-lg transition-all"
              >
                발달 상태 확인하기
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {result ? (
              <div className="bg-white p-8 rounded-3xl text-slate-800 shadow-xl animate-fade-in flex-grow border border-rose-100">
                <h2 className="text-xl font-bold mb-6 text-rose-500">발달 결과</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-5 bg-rose-50 rounded-2xl">
                    <span className="text-rose-700 font-bold">현재 나이</span>
                    <span className="text-2xl font-black text-rose-600">
                      {result.years > 0 ? `${result.years}세 ` : ''}{result.months % 12}개월 <span className="text-sm text-rose-400">({result.days}일째)</span>
                    </span>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="font-black text-slate-700 mb-3 flex items-center gap-2">
                      <span className="text-xl">💉</span> 현재 권장 예방접종
                    </h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {result.nextVaccination}
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 text-sm leading-relaxed text-indigo-800">
                  🍼 **초보 부모를 위한 팁** <br/>
                  아이가 태어난 지 {result.months}개월이 되었습니다. 이 시기에는 {result.months < 6 ? '완전 모유/분유 수유' : '이유식 병행'} 단계입니다. 아이의 성장 속도는 개인차가 있으니 참고용으로 활용하세요.
                </div>
              </div>
            ) : (
              <div className="bg-slate-200 p-8 rounded-3xl text-slate-400 flex flex-col items-center justify-center text-center flex-grow border-2 border-dashed border-slate-300">
                <span className="text-5xl mb-4 opacity-50">👶</span>
                <p className="font-bold text-lg">생년월일을 입력하시면<br/>성장 정보를 분석해 드립니다.</p>
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
