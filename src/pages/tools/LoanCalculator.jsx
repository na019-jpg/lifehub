import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';

export default function LoanCalculator() {
  const [amount, setAmount] = useState(10000000); // 1,000만원
  const [rate, setRate] = useState(3.5); // 3.5%
  const [term, setTerm] = useState(12); // 12개월
  const [result, setResult] = useState(null);

  const calculateLoan = () => {
    const principal = Number(amount);
    const monthlyRate = (Number(rate) / 100) / 12;
    const months = Number(term);
    
    // 원리금 균등 상환 공식
    // PMT = (P * r * (1 + r)^n) / ((1 + r)^n - 1)
    const pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalRepayment = pmt * months;
    const totalInterest = totalRepayment - principal;
    
    setResult({
      monthlyPayment: Math.round(pmt),
      totalRepayment: Math.round(totalRepayment),
      totalInterest: Math.round(totalInterest)
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SeoHelmet 
        title="대출 이자 계산기 - Smart Utility Hub" 
        description="원리금 균등 상환액과 총 이자 비용을 즉시 계산해 드립니다."
      />
      
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto max-w-4xl px-4">
          <Link to="/" className="text-blue-600 font-bold flex items-center gap-1 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-black text-slate-900">📉 대출 이자 계산기</h1>
          <p className="text-slate-500 font-medium mt-2">복잡한 대출 이자, 원리금 균등 상환액을 정확히 계산해 보세요.</p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6">대출 정보 입력</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">대출 금액 (원)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold text-lg"
                  step="100000"
                />
                <p className="text-[11px] text-slate-400 mt-1">{(Number(amount)).toLocaleString()} 원</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">연 이자율 (%)</label>
                  <input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">대출 기간 (개월)</label>
                  <input 
                    type="number" 
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
              </div>

              <button 
                onClick={calculateLoan}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-lg transition-all"
              >
                이자 계산하기
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {result ? (
              <div className="bg-white p-8 rounded-3xl text-slate-800 shadow-xl animate-fade-in flex-grow border border-slate-200">
                <h2 className="text-xl font-bold mb-6 text-slate-400">계산 결과</h2>
                
                <div className="space-y-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <span className="text-slate-500 font-bold block mb-1">월 평균 상환액</span>
                    <span className="text-4xl font-black text-blue-600">
                      {result.monthlyPayment.toLocaleString()} <span className="text-xl">원</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center px-4">
                      <span className="text-slate-500 font-bold">총 상환 금액</span>
                      <span className="text-xl font-black text-slate-800">{result.totalRepayment.toLocaleString()} 원</span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-slate-500 font-bold">총 이자 비용</span>
                      <span className="text-xl font-black text-amber-600">+{result.totalInterest.toLocaleString()} 원</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-amber-50 rounded-2xl border border-amber-100 text-sm leading-relaxed text-amber-800">
                  ⚠️ **중도상환 수수료 주의!** <br/>
                  대부분의 은행은 3년 이내 상환 시 약 0.5%~1.5%의 수수료가 발생할 수 있습니다. 상환 계획에 참고하세요.
                </div>
              </div>
            ) : (
              <div className="bg-slate-200 p-8 rounded-3xl text-slate-400 flex flex-col items-center justify-center text-center flex-grow border-2 border-dashed border-slate-300">
                <span className="text-5xl mb-4 opacity-50">💰</span>
                <p className="font-bold text-lg">대출 조건을 입력하시면<br/>상환 계획을 확인하실 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
