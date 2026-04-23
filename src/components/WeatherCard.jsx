import React from 'react';

export default function WeatherCard({ weather, manualTemp, isManual }) {
  const displayTemp = isManual ? manualTemp : (weather?.temp ?? manualTemp);
  const apparentTemp = isManual ? manualTemp : (weather?.apparentTemp ?? manualTemp);
  const humidity = isManual ? '-' : weather?.humidity;
  const precip = isManual ? '-' : weather?.precipitation;

  return (
    <section className="glass-panel rounded-3xl p-6 text-slate-800 shadow-xl relative overflow-hidden mb-6 transform transition-all hover:-translate-y-1 duration-300 w-full max-w-md mx-auto">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-12 blur-xl"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h2 className="text-sm font-semibold text-slate-600 mb-1 tracking-wide">
            {isManual ? '수동 온도 모드' : '현재 내 위치 날씨'}
          </h2>
          <div className="flex items-baseline gap-1">
            <span className="text-7xl font-bold tracking-tighter text-slate-900">{displayTemp}°</span>
          </div>
        </div>
        {!isManual && (
          <div className="flex items-center justify-center w-12 h-12 bg-white/60 rounded-full shadow-inner shadow-white">
            <span className="text-2xl" role="img" aria-label="weather-icon">📍</span>
          </div>
        )}
      </div>

      {!isManual && (
        <div className="grid grid-cols-3 gap-3 mt-8 relative z-10">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50 shadow-sm transition-transform hover:scale-[1.03]">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">체감온도</p>
            <p className="text-xl font-bold text-slate-800">{apparentTemp}°</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50 shadow-sm transition-transform hover:scale-[1.03]">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">습도</p>
            <p className="text-xl font-bold text-slate-800">{humidity}%</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50 shadow-sm transition-transform hover:scale-[1.03]">
            <p className="text-[11px] text-slate-500 font-bold mb-1 uppercase tracking-wider">강수량</p>
            <p className="text-xl font-bold text-slate-800">{precip}mm</p>
          </div>
        </div>
      )}
    </section>
  );
}
