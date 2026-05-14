import React, { useState } from 'react';
import Wizard from '../../../components/calculator/Wizard';
import ResultChart from '../../../components/calculator/ResultChart';
import SeoHelmet from '../../../components/SeoHelmet';
import { ArrowLeft, PiggyBank, Coins, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Step 1: Select Calculation Type
const TypeSelectionStep = ({ data, onNext }) => {
  const [selectedType, setSelectedType] = useState(data.type || 'deposit'); // deposit: 예금, savings: 적금

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setSelectedType('deposit')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            selectedType === 'deposit' 
              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
              : 'border-slate-200 bg-white hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${selectedType === 'deposit' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
              <PiggyBank className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">정기 예금 (거치식)</h3>
          </div>
          <p className="text-slate-500 text-sm">목돈을 한 번에 예치하고 만기에 이자를 받는 방식입니다.</p>
        </button>
        
        <button
          onClick={() => setSelectedType('savings')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            selectedType === 'savings' 
              ? 'border-indigo-500 bg-indigo-50 shadow-md' 
              : 'border-slate-200 bg-white hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${selectedType === 'savings' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">정기 적금 (적립식)</h3>
          </div>
          <p className="text-slate-500 text-sm">매달 일정한 금액을 납입하여 목돈을 만드는 방식입니다.</p>
        </button>
      </div>

      <div className="mt-auto pt-6 flex justify-end">
        <button 
          onClick={() => onNext({ type: selectedType })}
          className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          다음 단계 <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};

// Step 2: Input conditions
const ConditionsInputStep = ({ data, onNext, onPrev }) => {
  const [amount, setAmount] = useState(data.amount || '');
  const [months, setMonths] = useState(data.months || '12');
  const [rate, setRate] = useState(data.rate || '');

  const formatNumber = (val) => {
    if (!val) return '';
    return Number(val.replace(/,/g, '')).toLocaleString('ko-KR');
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(rawValue) && rawValue !== '') {
      setAmount(formatNumber(rawValue));
    } else if (rawValue === '') {
      setAmount('');
    }
  };

  const handleRateChange = (e) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(val) && Number(val) >= 0 && Number(val) <= 100)) {
      setRate(val);
    }
  };

  const handleMonthsChange = (e) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(val) && Number(val) > 0)) {
      setMonths(val);
    }
  };

  const isFormValid = amount && rate && months;

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {data.type === 'deposit' ? '예치 금액 (원금)' : '월 납입 금액'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
              autoFocus
            />
            <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">원</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">가입 기간</label>
            <div className="relative">
              <input
                type="number"
                value={months}
                onChange={handleMonthsChange}
                placeholder="12"
                className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
              />
              <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">개월</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">연 이자율 (단리)</label>
            <div className="relative">
              <input
                type="number"
                value={rate}
                onChange={handleRateChange}
                placeholder="0.0"
                step="0.1"
                className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
              />
              <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <button 
          onClick={onPrev}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold transition-colors"
        >
          이전
        </button>
        <button 
          onClick={() => onNext({ amount, months, rate })}
          disabled={!isFormValid}
          className="flex-grow bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          다음 단계 <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};

// Step 3: Tax Option
const TaxOptionStep = ({ data, onNext, onPrev }) => {
  const [taxType, setTaxType] = useState(data.taxType || 'general');

  const handleCalculate = () => {
    const rawAmount = Number(data.amount.replace(/,/g, ''));
    const termMonths = Number(data.months);
    const annualRate = Number(data.rate) / 100;
    
    let principal = 0;
    let preTaxInterest = 0;

    if (data.type === 'deposit') {
      principal = rawAmount;
      preTaxInterest = principal * annualRate * (termMonths / 12);
    } else {
      principal = rawAmount * termMonths;
      preTaxInterest = rawAmount * annualRate * (termMonths * (termMonths + 1) / 2) / 12;
    }

    let taxRate = 0;
    if (taxType === 'general') taxRate = 0.154; // 15.4%
    else if (taxType === 'privilege') taxRate = 0.095; // 9.5%
    else if (taxType === 'none') taxRate = 0; // 0%

    const taxAmount = Math.floor(preTaxInterest * taxRate);
    const afterTaxInterest = Math.floor(preTaxInterest - taxAmount);
    const totalReceive = principal + afterTaxInterest;

    onNext({ taxType, principal, preTaxInterest: Math.floor(preTaxInterest), taxAmount, afterTaxInterest, totalReceive });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 mb-8">
        <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-indigo-200 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="taxType" 
              value="general" 
              checked={taxType === 'general'} 
              onChange={() => setTaxType('general')}
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-slate-800">일반 과세 (15.4%)</div>
              <div className="text-sm text-slate-500">대부분의 일반적인 예적금 상품에 적용됩니다.</div>
            </div>
          </div>
        </label>

        <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-indigo-200 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="taxType" 
              value="privilege" 
              checked={taxType === 'privilege'} 
              onChange={() => setTaxType('privilege')}
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-slate-800">세금 우대 (9.5%)</div>
              <div className="text-sm text-slate-500">새마을금고, 신협 등 조합원 예탁금 등에 적용됩니다.</div>
            </div>
          </div>
        </label>

        <label className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-indigo-200 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="taxType" 
              value="none" 
              checked={taxType === 'none'} 
              onChange={() => setTaxType('none')}
              className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <div className="font-bold text-slate-800">비과세 (0%)</div>
              <div className="text-sm text-slate-500">비과세 종합저축 등 세금을 떼지 않는 상품입니다.</div>
            </div>
          </div>
        </label>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <button 
          onClick={onPrev}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold transition-colors"
        >
          이전
        </button>
        <button 
          onClick={handleCalculate}
          className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors"
        >
          계산하기
        </button>
      </div>
    </div>
  );
};

// Step 4: Result Display
const ResultStep = ({ data, onPrev }) => {
  const chartData = [
    { name: '원금', value: data.principal },
    { name: '세후 이자', value: data.afterTaxInterest }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
          <span className="text-slate-500 font-bold">만기 수령액 (세후)</span>
          <span className="text-2xl font-black text-indigo-600">
            {data.totalReceive.toLocaleString('ko-KR')}원
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2 text-sm md:text-base">
          <span className="text-slate-500 font-medium">원금</span>
          <span className="font-bold text-slate-800">
            {data.principal.toLocaleString('ko-KR')}원
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2 text-sm md:text-base">
          <span className="text-slate-500 font-medium">세전 이자</span>
          <span className="font-bold text-slate-600">
            {data.preTaxInterest.toLocaleString('ko-KR')}원
          </span>
        </div>

        <div className="flex justify-between items-center text-sm md:text-base">
          <span className="text-rose-400 font-medium">이자 과세 ({data.taxType === 'general' ? '15.4%' : data.taxType === 'privilege' ? '9.5%' : '0%'})</span>
          <span className="font-bold text-rose-500">
            -{data.taxAmount.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>

      <div className="mb-8">
        <ResultChart data={chartData} colors={['#6366f1', '#10b981']} />
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <button 
          onClick={onPrev}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center"
        >
          다시 계산
        </button>
        <button 
          className="flex-grow bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" /> 결과 공유하기
        </button>
      </div>
    </div>
  );
};


export default function SavingsCalculator() {
  const steps = [
    {
      title: '어떤 상품에 가입하시나요?',
      description: '예치 방식에 따라 이자 계산법이 다릅니다.',
      component: TypeSelectionStep
    },
    {
      title: '금액과 기간을 입력해 주세요',
      description: '정확한 단리 계산을 위해 정보를 입력해 주세요.',
      component: ConditionsInputStep
    },
    {
      title: '과세 방식을 선택해 주세요',
      description: '상품에 따라 부과되는 세금 비율이 다릅니다.',
      component: TaxOptionStep
    },
    {
      title: '계산 결과입니다',
      description: '만기 시 실제로 받게 될 금액 내역입니다.',
      component: ResultStep
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <SeoHelmet 
        title="예적금 만기 수령액 계산기 - LifeHub 계산기" 
        description="복잡한 예적금 이자, 15.4% 일반과세부터 비과세까지 실제 수령액을 정확히 계산해 드립니다."
      />
      
      <div className="max-w-2xl mx-auto mb-8">
        <Link to="/?cat=finance" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> 계산기 목록으로
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            🏦
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">예적금 만기 수령액 계산기</h1>
            <p className="text-slate-500 font-medium">세금을 제외한 진짜 내 이자를 정확하게 계산합니다.</p>
          </div>
        </div>
      </div>

      <Wizard steps={steps} />
    </div>
  );
}
