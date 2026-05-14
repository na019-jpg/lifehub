import React, { useState } from 'react';
import Wizard from '../../../components/calculator/Wizard';
import SeoHelmet from '../../../components/SeoHelmet';
import { ArrowLeft, TrendingDown, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Utility for formatting numbers
const formatNumber = (val) => {
  if (!val) return '';
  // allow decimals
  const parts = val.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const parseNumber = (val) => {
  return Number(val.replace(/,/g, ''));
};

// Step 1: Current Holding
const CurrentHoldingStep = ({ data, onNext }) => {
  const [currentPrice, setCurrentPrice] = useState(data.currentPrice || '');
  const [currentQty, setCurrentQty] = useState(data.currentQty || '');

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(rawValue) && rawValue !== '') {
      setCurrentPrice(formatNumber(rawValue));
    } else if (rawValue === '') {
      setCurrentPrice('');
    }
  };

  const handleQtyChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(rawValue) && rawValue !== '') {
      setCurrentQty(formatNumber(rawValue));
    } else if (rawValue === '') {
      setCurrentQty('');
    }
  };

  const isFormValid = currentPrice && currentQty;

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">기존 보유 평단가</label>
          <div className="relative">
            <input
              type="text"
              value={currentPrice}
              onChange={handlePriceChange}
              placeholder="0"
              className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
              autoFocus
            />
            <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">원</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">기존 보유 수량</label>
          <div className="relative">
            <input
              type="text"
              value={currentQty}
              onChange={handleQtyChange}
              placeholder="0"
              className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
            />
            <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">주</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex justify-end">
        <button 
          onClick={() => onNext({ currentPrice, currentQty })}
          disabled={!isFormValid}
          className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          다음 단계 <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  );
};

// Step 2: Additional Buy
const AdditionalBuyStep = ({ data, onNext, onPrev }) => {
  const [addPrice, setAddPrice] = useState(data.addPrice || '');
  const [addQty, setAddQty] = useState(data.addQty || '');

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(rawValue) && rawValue !== '') {
      setAddPrice(formatNumber(rawValue));
    } else if (rawValue === '') {
      setAddPrice('');
    }
  };

  const handleQtyChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!isNaN(rawValue) && rawValue !== '') {
      setAddQty(formatNumber(rawValue));
    } else if (rawValue === '') {
      setAddQty('');
    }
  };

  const handleCalculate = () => {
    const cp = parseNumber(data.currentPrice);
    const cq = parseNumber(data.currentQty);
    const ap = parseNumber(addPrice);
    const aq = parseNumber(addQty);

    const currentTotal = cp * cq;
    const addTotal = ap * aq;
    const finalTotal = currentTotal + addTotal;
    const finalQty = cq + aq;
    const finalAverage = finalTotal / finalQty;

    onNext({ 
      addPrice, 
      addQty, 
      finalAverage, 
      finalTotal, 
      finalQty,
      diffPercent: ((finalAverage - cp) / cp) * 100
    });
  };

  const isFormValid = addPrice && addQty;

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">추가 매수 단가</label>
          <div className="relative">
            <input
              type="text"
              value={addPrice}
              onChange={handlePriceChange}
              placeholder="0"
              className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
              autoFocus
            />
            <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">원</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">추가 매수 수량</label>
          <div className="relative">
            <input
              type="text"
              value={addQty}
              onChange={handleQtyChange}
              placeholder="0"
              className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-200 focus:border-indigo-500 py-2 pr-8 outline-none transition-colors bg-transparent placeholder-slate-300"
            />
            <span className="absolute right-0 bottom-3 text-lg font-bold text-slate-400">주</span>
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
          onClick={handleCalculate}
          disabled={!isFormValid}
          className="flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          계산하기
        </button>
      </div>
    </div>
  );
};

// Step 3: Result Display
const ResultStep = ({ data, onPrev }) => {
  const isLower = data.diffPercent < 0;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-slate-500 font-bold block mb-1">최종 평단가</span>
            <span className="text-3xl font-black text-indigo-600">
              {Math.floor(data.finalAverage).toLocaleString('ko-KR')}원
            </span>
          </div>
          <div className={`px-4 py-2 rounded-xl font-bold ${isLower ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isLower ? '📉 ' : '📈 '}{Math.abs(data.diffPercent).toFixed(2)}%
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-500 font-medium">기존 평단가</span>
          <span className="font-bold text-slate-800">
            {data.currentPrice}원
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-500 font-medium">총 매수 금액</span>
          <span className="font-bold text-slate-800">
            {Math.floor(data.finalTotal).toLocaleString('ko-KR')}원
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">총 보유 수량</span>
          <span className="font-bold text-slate-800">
            {data.finalQty.toLocaleString('ko-KR')}주
          </span>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8">
        <p className="text-indigo-800 font-medium text-sm leading-relaxed text-center">
          현재보다 <strong>{data.addPrice}원</strong>에 <strong>{data.addQty}주</strong>를 추가 매수하면,<br/>
          평단가가 <strong className={isLower ? 'text-emerald-600' : 'text-rose-600'}>{Math.abs(data.diffPercent).toFixed(2)}% {isLower ? '낮아집니다' : '높아집니다'}</strong>.
        </p>
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

export default function StockAverageCalculator() {
  const steps = [
    {
      title: '현재 보유하신 주식은?',
      description: '기존에 매수한 평단가와 수량을 입력해 주세요.',
      component: CurrentHoldingStep
    },
    {
      title: '얼마에 더 사실 건가요?',
      description: '추가로 매수할 단가와 수량을 입력해 주세요.',
      component: AdditionalBuyStep
    },
    {
      title: '계산 결과입니다',
      description: '추가 매수 시 변동되는 최종 평단가입니다.',
      component: ResultStep
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <SeoHelmet 
        title="주식 평단가(물타기) 계산기 - LifeHub 계산기" 
        description="추가 매수 시 변동되는 최종 평균 단가와 수익률을 1초 만에 확인하세요."
      />
      
      <div className="max-w-2xl mx-auto mb-8">
        <Link to="/?cat=finance" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> 계산기 목록으로
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            📈
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">주식 평단가 계산기</h1>
            <p className="text-slate-500 font-medium">일명 '물타기' 시나리오를 빠르고 정확하게 계산합니다.</p>
          </div>
        </div>
      </div>

      <Wizard steps={steps} />
    </div>
  );
}
