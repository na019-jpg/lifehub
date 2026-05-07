import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import SeoHelmet from '../../components/SeoHelmet';
import ToolTabs from '../../components/ToolTabs';

export default function UnitPriceChecker() {
  const [a, setA] = useState({ price: 12000, volume: 500, unit: 'g', isBogo: false });
  const [b, setB] = useState({ price: 15000, volume: 0.8, unit: 'kg', isBogo: false });

  // Refs for auto-focus
  const aPriceRef = useRef(null);
  const aVolRef = useRef(null);
  const bPriceRef = useRef(null);
  const bVolRef = useRef(null);

  const units = ['g', 'kg', 'ml', 'L', '개'];

  const convertToSmallest = (val, unit) => {
    const v = Number(val);
    if (unit === 'kg' || unit === 'L') return v * 1000;
    return v;
  };

  const analysis = useMemo(() => {
    const volA = convertToSmallest(a.volume, a.unit) * (a.isBogo ? 2 : 1);
    const volB = convertToSmallest(b.volume, b.unit) * (b.isBogo ? 2 : 1);
    
    if (!volA || !volB) return null;

    const unitPriceA = (Number(a.price) / volA) * 100;
    const unitPriceB = (Number(b.price) / volB) * 100;
    
    const diff = unitPriceA - unitPriceB;
    const diffPercent = (Math.abs(diff) / Math.max(unitPriceA, unitPriceB)) * 100;
    const isBCheaper = diff > 0;
    const isBulkTrap = (volB > volA * 1.5) && (unitPriceB > unitPriceA);

    return { unitPriceA, unitPriceB, diffPercent, isBCheaper, isBulkTrap };
  }, [a, b]);

  const handleEnter = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const formatValue = (val) => Math.round(val).toLocaleString();

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans">
      <SeoHelmet 
        title="스마트 단가 비교기 | LifeHub Finance" 
        description="마트에서 1+1 상품과 대용량 중 어떤 게 더 저렴할까요? 1초 만에 확인하세요."
      />

      <ToolTabs activeCategory="finance" />

      <main className="container mx-auto max-w-2xl px-6 py-12 space-y-8">
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            어떤 게 더 <span className="text-[#2E7D32]">저렴한가요?</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">100g/ml당 가격으로 정확하게 판별합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Product A Card */}
           <div className={`bg-white p-8 rounded-[40px] shadow-xl border-2 transition-all duration-300 ${analysis && !analysis.isBCheaper ? 'border-[#2E7D32]' : 'border-slate-50'}`}>
              <div className="flex justify-between items-center mb-8">
                 <span className="text-[10px] font-black text-[#1A237E] uppercase tracking-widest">Product A</span>
                 {analysis && !analysis.isBCheaper && <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-[10px] font-black uppercase">Best Choice</span>}
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Price (원)</label>
                    <input 
                      ref={aPriceRef}
                      type="number" 
                      inputMode="decimal"
                      value={a.price} 
                      onChange={e=>setA({...a, price: e.target.value})} 
                      onKeyDown={e=>handleEnter(e, aVolRef)}
                      className="w-full text-3xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#1A237E] outline-none pb-2 transition-all" 
                    />
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Volume</label>
                       <input 
                         ref={aVolRef}
                         type="number" 
                         inputMode="decimal"
                         value={a.volume} 
                         onChange={e=>setA({...a, volume: e.target.value})} 
                         onKeyDown={e=>handleEnter(e, bPriceRef)}
                         className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#1A237E] outline-none pb-2 transition-all" 
                       />
                    </div>
                    <select value={a.unit} onChange={e=>setA({...a, unit: e.target.value})} className="bg-slate-50 border-none rounded-2xl px-4 font-black text-xs text-[#1A237E] outline-none">
                       {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                 </div>
                 <label className="flex items-center gap-3 cursor-pointer group pt-4">
                    <input type="checkbox" checked={a.isBogo} onChange={e=>setA({...a, isBogo: e.target.checked})} className="w-5 h-5 rounded-lg accent-[#1A237E]" />
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-[#1A237E] transition-colors">1+1 상품인가요? (증정 포함)</span>
                 </label>
              </div>
           </div>

           {/* Product B Card */}
           <div className={`bg-white p-8 rounded-[40px] shadow-xl border-2 transition-all duration-300 ${analysis && analysis.isBCheaper ? 'border-[#2E7D32]' : 'border-slate-50'} ${analysis?.isBulkTrap ? 'animate-shake' : ''}`}>
              <div className="flex justify-between items-center mb-8">
                 <span className="text-[10px] font-black text-[#2E7D32] uppercase tracking-widest">Product B</span>
                 {analysis && analysis.isBCheaper && <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-[10px] font-black uppercase">Best Choice</span>}
              </div>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Price (원)</label>
                    <input 
                      ref={bPriceRef}
                      type="number" 
                      inputMode="decimal"
                      value={b.price} 
                      onChange={e=>setB({...b, price: e.target.value})} 
                      onKeyDown={e=>handleEnter(e, bVolRef)}
                      className="w-full text-3xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#2E7D32] outline-none pb-2 transition-all" 
                    />
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                       <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Volume</label>
                       <input 
                         ref={bVolRef}
                         type="number" 
                         inputMode="decimal"
                         value={b.volume} 
                         onChange={e=>setB({...b, volume: e.target.value})} 
                         className="w-full text-2xl font-black text-slate-900 border-b-2 border-slate-50 focus:border-[#2E7D32] outline-none pb-2 transition-all" 
                       />
                    </div>
                    <select value={b.unit} onChange={e=>setB({...b, unit: e.target.value})} className="bg-slate-50 border-none rounded-2xl px-4 font-black text-xs text-[#2E7D32] outline-none">
                       {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                 </div>
                 <label className="flex items-center gap-3 cursor-pointer group pt-4">
                    <input type="checkbox" checked={b.isBogo} onChange={e=>setB({...b, isBogo: e.target.checked})} className="w-5 h-5 rounded-lg accent-[#2E7D32]" />
                    <span className="text-[10px] font-black text-slate-500 group-hover:text-[#2E7D32] transition-colors">1+1 상품인가요? (증정 포함)</span>
                 </label>
              </div>
           </div>
        </div>

        {analysis && (
           <div className="space-y-6">
              {/* Result Summary */}
              <div className="bg-[#1A237E] rounded-[40px] p-10 shadow-2xl text-white text-center relative overflow-hidden animate-fade-up">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                 
                 <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-8">Saving Analysis</h3>
                 
                 <div className="space-y-4">
                    <div className="text-sm font-bold text-white/70">
                       Product <span className="text-[#4CAF50] font-black">{analysis.isBCheaper ? 'B' : 'A'}</span> 상품이 더 경제적입니다
                    </div>
                    <div className="text-6xl font-black tracking-tighter">
                       {Math.round(analysis.diffPercent)}% <span className="text-xl opacity-40">SAVED</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-center gap-8">
                       <div className="text-center">
                          <span className="text-[8px] font-black opacity-40 uppercase block mb-1">Unit Price A</span>
                          <span className="text-xs font-black">{formatValue(analysis.unitPriceA)}원</span>
                       </div>
                       <div className="text-center">
                          <span className="text-[8px] font-black opacity-40 uppercase block mb-1">Unit Price B</span>
                          <span className="text-xs font-black">{formatValue(analysis.unitPriceB)}원</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bulk Trap Alert */}
              {analysis.isBulkTrap && (
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] flex items-center gap-6 animate-fade-up">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">🛑</div>
                   <div className="flex-1">
                      <h4 className="text-sm font-black text-rose-600 mb-1">대용량의 함정 주의!</h4>
                      <p className="text-[10px] font-bold text-rose-400 leading-relaxed">
                         단가가 더 비싼 대용량 상품입니다. <br/>
                         소용량을 여러 개 사는 것이 약 <span className="underline decoration-rose-300 underline-offset-2">{formatValue(Math.abs(analysis.unitPriceA - analysis.unitPriceB) * 10)}원</span> 더 저렴합니다.
                      </p>
                   </div>
                </div>
              )}

              {/* Affiliate CTA */}
              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-50 flex flex-col md:flex-row items-center gap-8 group cursor-pointer hover:border-[#2E7D32] transition-all">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🛒</div>
                 <div className="flex-1 text-center md:text-left">
                    <h4 className="text-sm font-black text-slate-900 mb-1">쿠팡에서 묶음 상품 최저가 확인</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Coupang Lowest Price Matching</p>
                 </div>
                 <button className="bg-[#1A237E] text-white px-8 py-4 rounded-2xl font-black text-xs shadow-lg group-hover:bg-[#2E7D32] transition-colors">
                    지금 확인하기
                 </button>
              </div>
           </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up 0.5s ease-out forwards; }
      `}} />
    </div>
  );
}
