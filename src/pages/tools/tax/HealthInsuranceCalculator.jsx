import React, { useState } from 'react';
import Wizard from '../../../components/calculator/Wizard';
import ResultChart from '../../../components/calculator/ResultChart';
import SeoHelmet from '../../../components/SeoHelmet';
import { Share2 } from 'lucide-react';

export default function HealthInsuranceCalculator() {
  const [income, setIncome] = useState('');
  const [property, setProperty] = useState('');
  const [carValue, setCarValue] = useState('');

  const handleCalculate = () => {
    const inc = Number(income.replace(/,/g, '')) || 0;
    const prop = Number(property.replace(/,/g, '')) || 0;
    const car = Number(carValue.replace(/,/g, '')) || 0;

    // 2024 Health Insurance Simplified Calculation for Local Subscribers
    // 소득보험료 = 소득액 * 7.09% (간소화)
    const incomePremium = Math.max(0, inc * 0.0709);

    // 재산보험료 (기본 공제 5000만원 가정, 간소화된 점수제 환산)
    const taxableProp = Math.max(0, prop - 50000000);
    const propPremium = taxableProp > 0 ? (taxableProp / 10000000) * 15000 : 0; // 천만원당 대략 1.5만원 (간이 계산)

    // 자동차보험료 (4천만원 이상만 부과됨, 간소화)
    const carPremium = car >= 40000000 ? 20000 : 0; 

    const totalHealthPremium = incomePremium + propPremium + carPremium;
    const longTermCarePremium = totalHealthPremium * 0.1295; // 장기요양보험료 12.95%
    const finalPremium = totalHealthPremium + longTermCarePremium;

    return {
      incomePremium,
      propPremium,
      carPremium,
      totalHealthPremium,
      longTermCarePremium,
      finalPremium
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
      title: '소득 입력',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">연간 소득금액 (원)</label>
            <input
              type="text"
              value={income}
              onChange={(e) => handleInputChange(e, setIncome)}
              placeholder="사업, 이자, 배당, 연금 등 합산 (예: 30,000,000)"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            💡 필요경비를 제외한 '소득금액'을 입력해주세요. 근로소득은 20%, 연금소득은 50%만 반영됩니다.
          </p>
        </div>
      )
    },
    {
      title: '재산 및 자동차',
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">주택/토지 과세표준액 (원)</label>
            <input
              type="text"
              value={property}
              onChange={(e) => handleInputChange(e, setProperty)}
              placeholder="예: 300,000,000"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">자동차 차량가액 (원)</label>
            <input
              type="text"
              value={carValue}
              onChange={(e) => handleInputChange(e, setCarValue)}
              placeholder="예: 45,000,000"
              className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
            />
          </div>
          <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
            💡 자동차는 4천만 원 이상인 경우에만 부과됩니다. 재산은 공시지가 기준 과세표준액을 대략적으로 입력하세요.
          </p>
        </div>
      )
    },
    {
      title: '결과 확인',
      content: (() => {
        const result = handleCalculate();
        if (result.finalPremium === 0) return <div className="text-center py-10 text-slate-500">계산된 보험료가 없습니다.</div>;

        const chartData = [
          { name: '소득 기반', value: result.incomePremium, fill: '#3b82f6' },
          { name: '재산 기반', value: result.propPremium, fill: '#10b981' },
          { name: '자동차 기반', value: result.carPremium, fill: '#8b5cf6' },
          { name: '장기요양', value: result.longTermCarePremium, fill: '#f43f5e' }
        ];

        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">예상 월 건강보험료</h3>
              <div className="text-4xl font-extrabold text-indigo-600 text-center mb-6">
                {Math.round(result.finalPremium / 12).toLocaleString()}원 <span className="text-base text-slate-500 font-normal">/ 월</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-indigo-100/50 text-blue-600">
                  <span>소득 보험료 (연)</span>
                  <span className="font-semibold">{Math.round(result.incomePremium).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-indigo-100/50 text-emerald-600">
                  <span>재산 보험료 (연)</span>
                  <span className="font-semibold">{Math.round(result.propPremium).toLocaleString()}원</span>
                </div>
                {result.carPremium > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-indigo-100/50 text-purple-600">
                    <span>자동차 보험료 (연)</span>
                    <span className="font-semibold">{Math.round(result.carPremium).toLocaleString()}원</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-indigo-100/50 text-rose-500">
                  <span>장기요양보험료 (연)</span>
                  <span className="font-semibold">{Math.round(result.longTermCarePremium).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center py-2 font-bold text-slate-800">
                  <span>연간 총 납부 예상액</span>
                  <span>{Math.round(result.finalPremium).toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">보험료 구성 비율</h4>
              <ResultChart data={chartData.filter(d => d.value > 0)} />
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] font-bold py-4 rounded-xl transition-colors shadow-sm">
              <Share2 className="w-5 h-5" />
              카카오톡으로 내 건보료 결과 공유하기
            </button>
          </div>
        );
      })()
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <SeoHelmet 
        title="지역 건강보험료 예상 계산기" 
        description="지역가입자 전환 시 소득, 재산, 자동차를 기준으로 예상 건강보험료를 계산합니다." 
      />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">건강보험료 예상 계산기 🏥</h1>
        <p className="text-slate-500">직장에서 지역가입자로 전환 시, 월 건강보험료 폭탄을 미리 대비하세요.</p>
      </div>

      <Wizard steps={steps} onComplete={() => console.log('Calculate complete')} />
    </div>
  );
}
