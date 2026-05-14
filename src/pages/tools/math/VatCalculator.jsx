import React, { useState } from 'react';
import Wizard from '../../../components/calculator/Wizard';
import ResultChart from '../../../components/calculator/ResultChart';
import SeoHelmet from '../../../components/SeoHelmet';
import { ArrowLeft, Calculator, RotateCcw, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Step 1: Select Calculation Type
const TypeSelectionStep = ({ data, onNext }) => {
  const [selectedType, setSelectedType] = useState(data.type || 'exclude'); // exclude: 공급가액 기준, include: 합계금액 기준

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setSelectedType('exclude')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            selectedType === 'exclude' 
              ? 'border-emerald-500 bg-emerald-50 shadow-md' 
              : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${selectedType === 'exclude' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">공급가액 기준</h3>
          </div>
          <p className="text-slate-500 text-sm">입력한 금액에 10%의 부가세를 <span className="font-bold text-emerald-600">더합니다</span>.</p>
        </button>
        
        <button
          onClick={() => setSelectedType('include')}
          className={`p-6 rounded-2xl border-2 text-left transition-all ${
            selectedType === 'include' 
              ? 'border-emerald-500 bg-emerald-50 shadow-md' 
              : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl ${selectedType === 'include' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">합계금액 기준</h3>
          </div>
          <p className="text-slate-500 text-sm">입력한 금액에서 공급가액과 부가세를 <span className="font-bold text-emerald-600">역산합니다</span>.</p>
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

// Step 2: Amount Input
const AmountInputStep = ({ data, onNext, onPrev }) => {
  const [amount, setAmount] = useState(data.amount || '');

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

  const handleCalculate = () => {
    if (!amount) return;
    
    const rawAmount = Number(amount.replace(/,/g, ''));
    let supplyValue, vatValue, totalValue;

    if (data.type === 'exclude') {
      supplyValue = rawAmount;
      vatValue = Math.floor(rawAmount * 0.1);
      totalValue = supplyValue + vatValue;
    } else {
      totalValue = rawAmount;
      supplyValue = Math.round(rawAmount / 1.1);
      vatValue = totalValue - supplyValue;
    }

    onNext({ amount, supplyValue, vatValue, totalValue });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {data.type === 'exclude' ? '공급가액 (세전 금액)' : '합계금액 (세후 금액)'}
        </label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full text-3xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-emerald-500 py-3 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
            autoFocus
          />
          <span className="absolute right-0 bottom-4 text-xl font-bold text-slate-400">원</span>
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
          onClick={handleCalculate}
          disabled={!amount}
          className="flex-grow bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold transition-colors"
        >
          계산하기
        </button>
      </div>
    </div>
  );
};

// Step 3: Result Display
const ResultStep = ({ data, onPrev }) => {
  const chartData = [
    { name: '공급가액', value: data.supplyValue },
    { name: '부가세 (10%)', value: data.vatValue }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
          <span className="text-slate-500 font-bold">합계금액 (총액)</span>
          <span className="text-2xl font-black text-emerald-600">
            {data.totalValue.toLocaleString('ko-KR')}원
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-500 font-medium">공급가액</span>
          <span className="text-lg font-bold text-slate-800">
            {data.supplyValue.toLocaleString('ko-KR')}원
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">부가가치세 (10%)</span>
          <span className="text-lg font-bold text-blue-600">
            {data.vatValue.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>

      <div className="mb-8">
        <ResultChart data={chartData} colors={['#10b981', '#3b82f6']} />
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
          <Share2 className="w-4 h-4" /> 카카오톡 공유
        </button>
      </div>
    </div>
  );
};


export default function VatCalculator() {
  const steps = [
    {
      title: '무엇을 기준으로 계산할까요?',
      description: '가지고 계신 금액의 성격을 선택해 주세요.',
      component: TypeSelectionStep
    },
    {
      title: '금액을 입력해 주세요',
      description: '계산할 기준 금액을 원 단위로 입력해 주세요.',
      component: AmountInputStep
    },
    {
      title: '계산 결과입니다',
      description: '입력하신 금액을 바탕으로 한 부가세 내역입니다.',
      component: ResultStep
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <SeoHelmet 
        title="부가가치세 (별도/포함) 계산기 - LifeHub 계산기" 
        description="견적서를 쓸 때 세전 금액과 세후 금액을 빠르게 역산합니다. 복잡한 부가세 계산을 1초만에 해결하세요."
      />
      
      <div className="max-w-2xl mx-auto mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> 계산기 목록으로
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            🧾
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">부가가치세 계산기</h1>
            <p className="text-slate-500 font-medium">세전/세후 금액을 단 1초만에 정확하게 역산합니다.</p>
          </div>
        </div>
      </div>

      <Wizard steps={steps} />
    </div>
  );
}
