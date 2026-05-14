import React, { useState } from 'react';
import Wizard from '../../../components/calculator/Wizard';
import ResultChart from '../../../components/calculator/ResultChart';
import SeoHelmet from '../../../components/SeoHelmet';
import { Share2 } from 'lucide-react';

export default function IncomeTaxCalculator() {
  const [revenue, setRevenue] = useState('');
  const [expense, setExpense] = useState('');
  const [deduction, setDeduction] = useState('');
  
  const handleCalculate = () => {
    const rev = Number(revenue.replace(/,/g, '')) || 0;
    const exp = Number(expense.replace(/,/g, '')) || 0;
    const ded = Number(deduction.replace(/,/g, '')) || 0;
    
    const taxBase = Math.max(0, rev - exp - ded);
    let tax = 0;
    
    // 2024 Income Tax Brackets (Simplified)
    if (taxBase <= 14000000) tax = taxBase * 0.06;
    else if (taxBase <= 50000000) tax = 14000000 * 0.06 + (taxBase - 14000000) * 0.15;
    else if (taxBase <= 88000000) tax = 14000000 * 0.06 + 36000000 * 0.15 + (taxBase - 50000000) * 0.24;
    else if (taxBase <= 150000000) tax = 14000000 * 0.06 + 36000000 * 0.15 + 38000000 * 0.24 + (taxBase - 88000000) * 0.35;
    else tax = 14000000 * 0.06 + 36000000 * 0.15 + 38000000 * 0.24 + 62000000 * 0.35 + (taxBase - 150000000) * 0.38;
    
    const localTax = tax * 0.1;
    const totalTax = tax + localTax;
    const netIncome = Math.max(0, rev - exp - totalTax);

    return {
      revenue: rev,
      expense: exp,
      taxBase,
      tax,
      localTax,
      totalTax,
      netIncome
    };
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInputChange = (e, setter) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) && value !== '') {
      setter(formatNumber(value));
    } else if (value === '') {
      setter('');
    }
  };

  const steps = [
    {
      title: '총수입 입력',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">연간 총수입 금액 (원)</label>
            <input
              type="text"
              value={revenue}
              onChange={(e) => handleInputChange(e, setRevenue)}
              placeholder="예: 50,000,000"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            💡 프리랜서, 1인 기업, 1년 동안 벌어들인 모든 매출을 합산한 금액을 입력해주세요.
          </p>
        </div>
      )
    },
    {
      title: '경비 및 공제 입력',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">필요경비 (원)</label>
            <input
              type="text"
              value={expense}
              onChange={(e) => handleInputChange(e, setExpense)}
              placeholder="예: 20,000,000"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">소득공제액 (원)</label>
            <input
              type="text"
              value={deduction}
              onChange={(e) => handleInputChange(e, setDeduction)}
              placeholder="기본공제, 국민연금 등 합계 (예: 2,500,000)"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            💡 필요경비는 사업을 위해 지출한 비용, 소득공제는 인적공제 및 연금보험료 등입니다. 대략적인 예상액을 입력하세요.
          </p>
        </div>
      )
    },
    {
      title: '결과 확인',
      content: (() => {
        const result = handleCalculate();
        if (result.revenue === 0) return <div className="text-center py-10 text-slate-500">입력된 수입이 없습니다.</div>;

        const chartData = [
          { name: '세후 순수익', value: result.netIncome, fill: '#10b981' },
          { name: '필요경비', value: result.expense, fill: '#94a3b8' },
          { name: '총 납부세액', value: result.totalTax, fill: '#ef4444' }
        ];

        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">예상 납부 세액</h3>
              <div className="text-4xl font-extrabold text-emerald-600 text-center mb-6">
                {Math.round(result.totalTax).toLocaleString()}원
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50">
                  <span className="text-slate-600">총수입</span>
                  <span className="font-semibold text-slate-800">{Math.round(result.revenue).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50">
                  <span className="text-slate-600">경비 및 공제 합계</span>
                  <span className="font-semibold text-slate-800">- {Math.round(result.expense + Number(deduction.replace(/,/g, '')||0)).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50">
                  <span className="text-slate-600">과세표준</span>
                  <span className="font-semibold text-slate-800">{Math.round(result.taxBase).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50 text-rose-600">
                  <span>소득세</span>
                  <span className="font-semibold">{Math.round(result.tax).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 text-rose-600">
                  <span>지방소득세 (10%)</span>
                  <span className="font-semibold">{Math.round(result.localTax).toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">총수입 분배 비율</h4>
              <ResultChart data={chartData} />
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] font-bold py-4 rounded-xl transition-colors shadow-sm">
              <Share2 className="w-5 h-5" />
              카카오톡으로 내 세금 결과 공유하기
            </button>
          </div>
        );
      })()
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <SeoHelmet 
        title="종합소득세 예상 계산기" 
        description="프리랜서, 1인기업을 위한 종합소득세 예상 세액을 빠르게 계산합니다." 
      />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">종합소득세 예상 계산기 🧾</h1>
        <p className="text-slate-500">복잡한 5월 종소세, 내 수입에 맞춰 예상 세액을 1초 만에 확인하세요.</p>
      </div>

      <Wizard steps={steps} onComplete={() => console.log('Calculate complete')} />
    </div>
  );
}
