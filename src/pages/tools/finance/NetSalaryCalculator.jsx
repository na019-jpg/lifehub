import React, { useState } from 'react';
import Wizard from '../../../components/calculator/Wizard';
import ResultChart from '../../../components/calculator/ResultChart';
import SeoHelmet from '../../../components/SeoHelmet';
import { Share2 } from 'lucide-react';

export default function NetSalaryCalculator() {
  const [salary, setSalary] = useState('');
  const [nonTaxable, setNonTaxable] = useState('200000'); // 기본 비과세 식대 20만원 세팅
  const [dependents, setDependents] = useState('1');

  const handleCalculate = () => {
    const annualSalary = Number(salary.replace(/,/g, '')) || 0;
    const monthlyNonTaxable = Number(nonTaxable.replace(/,/g, '')) || 0;
    const deps = Number(dependents) || 1;

    const monthlySalary = annualSalary / 12;
    const taxableIncome = Math.max(0, monthlySalary - monthlyNonTaxable);

    // 2024년 4대보험 요율 적용
    const nationalPension = Math.min(taxableIncome * 0.045, 265500); // 상한액 반영 (대략)
    const healthInsurance = taxableIncome * 0.03545; // 건강보험 3.545%
    const longTermCare = healthInsurance * 0.1295; // 장기요양 12.95%
    const empInsurance = taxableIncome * 0.009; // 고용보험 0.9%

    // 소득세 간이세액표 (매우 간소화된 추정치 - 부양가족 1인 기준)
    let incomeTax = 0;
    if (taxableIncome > 1060000) {
      // 대략적인 누진율 적용 (정확한 간이세액표는 복잡하므로 퍼센트로 추정)
      if (taxableIncome <= 3000000) incomeTax = (taxableIncome - 1060000) * 0.03;
      else if (taxableIncome <= 5000000) incomeTax = 58200 + (taxableIncome - 3000000) * 0.08;
      else if (taxableIncome <= 10000000) incomeTax = 218200 + (taxableIncome - 5000000) * 0.15;
      else incomeTax = 968200 + (taxableIncome - 10000000) * 0.25;
      
      // 부양가족 공제 (1인당 대략 월 1.5만원 감면)
      incomeTax = Math.max(0, incomeTax - (deps - 1) * 15000);
    }
    
    const localIncomeTax = incomeTax * 0.1;

    const totalDeduction = nationalPension + healthInsurance + longTermCare + empInsurance + incomeTax + localIncomeTax;
    const netSalary = monthlySalary - totalDeduction;

    return {
      monthlySalary,
      nationalPension,
      healthInsurance,
      longTermCare,
      empInsurance,
      incomeTax,
      localIncomeTax,
      totalDeduction,
      netSalary
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
      title: '연봉 입력',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">계약 연봉 (원)</label>
            <input
              type="text"
              value={salary}
              onChange={(e) => handleInputChange(e, setSalary)}
              placeholder="예: 40,000,000"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">월 비과세액 (원)</label>
            <input
              type="text"
              value={nonTaxable}
              onChange={(e) => handleInputChange(e, setNonTaxable)}
              placeholder="식대 등 (기본 200,000)"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            💡 비과세액은 세금 및 4대보험 부과 대상에서 제외됩니다. (식대 한도 월 20만 원)
          </p>
        </div>
      )
    },
    {
      title: '부양가족',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">본인 포함 부양가족 수</label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold bg-white"
            >
              <option value="1">1명 (본인만)</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명 이상</option>
            </select>
          </div>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            💡 부양가족 수가 많을수록 매월 공제되는 소득세가 줄어듭니다.
          </p>
        </div>
      )
    },
    {
      title: '실수령액',
      content: (() => {
        const result = handleCalculate();
        if (result.monthlySalary === 0) return <div className="text-center py-10 text-slate-500">입력된 연봉이 없습니다.</div>;

        const chartData = [
          { name: '월 실수령액', value: result.netSalary, fill: '#10b981' },
          { name: '4대보험', value: result.nationalPension + result.healthInsurance + result.longTermCare + result.empInsurance, fill: '#3b82f6' },
          { name: '소득세/지방세', value: result.incomeTax + result.localIncomeTax, fill: '#ef4444' }
        ];

        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">예상 월 실수령액</h3>
              <div className="text-4xl font-extrabold text-emerald-600 text-center mb-6">
                {Math.round(result.netSalary).toLocaleString()}원
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50">
                  <span className="text-slate-600">월 환산 급여 (세전)</span>
                  <span className="font-semibold text-slate-800">{Math.round(result.monthlySalary).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50 text-blue-600">
                  <span>국민연금 (4.5%)</span>
                  <span className="font-semibold">- {Math.round(result.nationalPension).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50 text-blue-600">
                  <span>건강보험 (3.545%)</span>
                  <span className="font-semibold">- {Math.round(result.healthInsurance).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50 text-blue-600">
                  <span>고용보험 (0.9%)</span>
                  <span className="font-semibold">- {Math.round(result.empInsurance).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50 text-rose-500">
                  <span>소득세 (간이세액)</span>
                  <span className="font-semibold">- {Math.round(result.incomeTax).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-100/50 text-rose-500">
                  <span>지방소득세 (10%)</span>
                  <span className="font-semibold">- {Math.round(result.localIncomeTax).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 font-bold text-slate-800">
                  <span>공제액 합계</span>
                  <span>- {Math.round(result.totalDeduction).toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">월급 구성 비율</h4>
              <ResultChart data={chartData} />
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] font-bold py-4 rounded-xl transition-colors shadow-sm">
              <Share2 className="w-5 h-5" />
              카카오톡으로 내 월급 명세서 공유하기
            </button>
          </div>
        );
      })()
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <SeoHelmet 
        title="연봉 실수령액 계산기" 
        description="4대 보험 및 소득세를 공제한 정확한 매월 실수령액을 확인하세요." 
      />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">연봉 실수령액 계산기 💸</h1>
        <p className="text-slate-500">내 연봉의 진짜 주인을 찾아라! 통장에 찍히는 진짜 월급을 알려드립니다.</p>
      </div>

      <Wizard steps={steps} onComplete={() => console.log('Calculate complete')} />
    </div>
  );
}
