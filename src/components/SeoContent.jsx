import React from 'react';

export default function SeoContent() {
  return (
    <article className="mt-16 bg-white/40 rounded-3xl p-8 max-w-3xl mx-auto text-slate-800 shadow-sm border border-white/30 backdrop-blur-sm">
      <header className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-2">왜 기온별 옷차림을 알아야 할까요?</h2>
        <p className="text-slate-600 font-medium">외출 전 필수 체크리스트와 날씨 코디 가이드</p>
      </header>
      
      <section className="mb-8">
        <p className="mb-4 leading-relaxed font-medium">
          매일 아침 외출 준비를 할 때 <strong>"오늘 뭐 입지?"</strong> 고민해 본 적 있으신가요? 
          단순히 현재 기온 수치만 확인하는 것으로는 하루 종일 쾌적하게 생활하기 어렵습니다. 
          바람의 세기에 따른 체감 온도, 습도, 일교차 등 다양한 기상 조건을 종합적으로 고려하여 옷차림을 결정하는 것이 매우 중요합니다.
        </p>
      </section>
      
      <section className="mb-8">
        <h3 className="text-xl font-bold mt-6 mb-3 flex items-center gap-2">
          <span>🌡️</span> 체감 온도의 중요성
        </h3>
        <p className="mb-4 leading-relaxed">
          실제 온도계가 가리키는 기온과 우리가 직접 피부로 느끼는 <strong>체감 온도</strong>는 크게 다를 수 있습니다. 
          특히 겨울철에는 바람이 강하게 불면 체감 온도가 급격히 떨어지며, 여름철에는 습도가 높으면 실제 기온보다 훨씬 후덥지근하고 불쾌감이 높아집니다. 
          따라서 온도계의 숫자뿐만 아니라 체감온도와 습도를 복합적으로 바탕으로 그날의 패션을 정해야 감기를 예방하고 쾌적함을 유지할 수 있습니다.
        </p>
      </section>
      
      <section className="mb-8">
        <h3 className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
          <span>📅</span> 계절 및 기온별 필수 코디 핵심 가이드
        </h3>
        <ul className="space-y-4">
          <li className="bg-white/50 p-4 rounded-xl border border-white/40">
            <strong className="text-orange-600 block mb-1">여름 무더위 (28°C 이상)</strong>
             햇빛을 차단하고 땀을 빠르게 말려주는 통풍이 잘 되는 린넨 소재 의류가 필수입니다. 민소매, 반팔, 숏팬츠를 적극 활용하세요.
          </li>
          <li className="bg-white/50 p-4 rounded-xl border border-white/40">
            <strong className="text-green-600 block mb-1">봄/가을 환절기 (17°C ~ 22°C)</strong>
             아침 저녁으로 일교차가 큰 시기입니다. 얇은 반팔과 긴팔을 겹쳐 입거나, 입고 벗기 편한 가디건, 얇은 자켓 등의 아우터가 체온 유지에 큰 도움을 줍니다.
          </li>
          <li className="bg-white/50 p-4 rounded-xl border border-white/40">
            <strong className="text-blue-600 block mb-1">겨울 한파 (5°C 이하)</strong>
             옷을 여러 겹 껴입는 레이어드 룩이 보온성을 극대화합니다. 내복(히트텍)을 입은 후 모직 코트나 두꺼운 롱패딩으로 찬 바람을 막아주세요.
          </li>
        </ul>
      </section>

      <footer className="mt-8 border-t border-slate-300/50 pt-6">
        <p className="leading-relaxed text-sm text-slate-600 font-medium text-center">
          본 서비스는 실시간 기상 정보를 분석하여 가장 정확하고 유용한 데일리 옷차림 정보를 제공하고 있습니다. 
          매일 아침 시간 낭비를 줄이고 완벽한 OOTD(Outfit Of The Day)를 완성해 보세요!
        </p>
      </footer>
    </article>
  );
}
