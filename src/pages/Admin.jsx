import React, { useState, useMemo } from 'react';
import SeoHelmet from '../components/SeoHelmet';
import { generateTistoryPost } from '../utils/gemini';

// --- Mock Data for Trends ---
const TREND_DATA = {
  finance: [
    "청년도약계좌 조건", "디딤돌 대출 금리", "소상공인 대환대출", "특례보금자리론 신청",
    "ISA 계좌 장단점", "연말정산 환급금", "기초노령연금 수급자격", "신생아 특례대출",
    "부동산 취득세 계산", "햇살론 유스 조건", "버팀목 전세자금대출", "연금저축펀드 ETF",
    "주택청약 1순위 조건", "근로장려금 지급일", "종합소득세 신고기간"
  ],
  insurance: [
    "실손보험 청구서류", "자동차보험 비교견적", "치아보험 면책기간", "운전자보험 필요성",
    "종신보험 해지환급금", "개인파산 신청자격", "개인회생 절차", "무해지 환급형 보험",
    "간병인 보험 추천", "암보험 진단비", "이혼 재산분할 비율", "유류분 반환청구소송",
    "산재보험 처리절차", "태아보험 가입시기", "상속세 면제한도"
  ],
  travel: [
    "일본 여행 준비물", "오사카 유니버셜 스튜디오", "다낭 풀빌라 추천", "제주도 2박3일 코스",
    "방콕 항공권 특가", "유럽 여행 소매치기", "대만 e-gate 등록", "괌 가족여행 리조트",
    "비짓재팬웹 등록방법", "트래블로그 환전", "세부 호핑투어", "인천공항 스마트패스",
    "여권 재발급 준비물", "도쿄 디즈니랜드", "나트랑 마사지 추천"
  ],
  car: [
    "전기차 보조금 조회", "아이오닉6 실주행거리", "하이브리드 취등록세", "테슬라 모델Y 보조금",
    "엔진오일 교환주기", "중고차 구매요령", "타이어 교체비용", "장기렌트카 장단점",
    "자동차 검사 예약", "음주운전 처벌기준", "자동차세 연납할인", "쏘렌토 하이브리드 대기",
    "블랙박스 추천", "하이패스 단말기 등록", "전기차 충전요금"
  ],
  health: [
    "임플란트 가격비교", "백내장 수술비용", "대상포진 예방접종", "고지혈증 수치",
    "당뇨 초기증상", "오메가3 효능", "루테인 지아잔틴", "공황장애 극복",
    "수면다원검사 실비", "도수치료 가격", "틀니 건강보험", "다이어트 보조제 추천",
    "탈모약 부작용", "보청기 지원금", "역류성 식도염 증상"
  ]
};

const CATEGORIES = [
  { id: 'finance', name: '금융/정부지원/부동산', icon: '💰' },
  { id: 'insurance', name: '보험/법률', icon: '⚖️' },
  { id: 'travel', name: '여행/관광/항공', icon: '✈️' },
  { id: 'car', name: '자동차/전기차', icon: '🚗' },
  { id: 'health', name: '의학지식/건강/노인', icon: '🏥' }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('finance');
  const [tistoryKeyword, setTistoryKeyword] = useState('');
  const [targetLink, setTargetLink] = useState('/m');
  const [tistoryAiLoading, setTistoryAiLoading] = useState(false);
  const [tistoryAiResult, setTistoryAiResult] = useState(null);

  // 날짜 기반 렌덤 목데이터 추출 (매일 10시 갱신을 흉내내기 위해 오늘 날짜로 시드 생성)
  const todaysTrends = useMemo(() => {
    const today = new Date();
    // 오전 10시 이전이면 어제 날짜를 기준으로 함
    if (today.getHours() < 10) today.setDate(today.getDate() - 1);
    
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // 카테고리별로 10개씩 추출
    const getTrends = (catId) => {
      const list = [...TREND_DATA[catId]];
      // Fisher-Yates shuffle with pseudo-random seed
      let m = list.length, t, i;
      let currentSeed = seed;
      while (m) {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        i = Math.floor((currentSeed / 233280) * m--);
        t = list[m];
        list[m] = list[i];
        list[i] = t;
      }
      return list.slice(0, 10);
    };

    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = getTrends(cat.id);
      return acc;
    }, {});
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '0000') setIsAuthenticated(true);
    else alert('비밀번호가 일치하지 않습니다.');
  };

  const handleGenerateTistoryAi = async () => {
    if (!tistoryKeyword.trim()) {
      alert('키워드를 입력해주세요.');
      return;
    }
    setTistoryAiLoading(true);
    setTistoryAiResult(null);
    try {
      const result = await generateTistoryPost(tistoryKeyword, targetLink || '/m');
      setTistoryAiResult(result);
    } catch (err) {
      alert("AI 생성 실패: " + err.message);
    } finally {
      setTistoryAiLoading(false);
    }
  };

  const handleCopyTistoryAiHtml = () => {
    if (!tistoryAiResult) return;
    navigator.clipboard.writeText(tistoryAiResult.htmlContent).then(() => {
      alert("✅ 티스토리용 최적화 HTML이 복사되었습니다!\\n티스토리 기본모드를 HTML로 변경하고 붙여넣기 하세요.");
    }).catch(err => alert("복사 실패: " + err));
  };

  const handleTrendClick = (keyword) => {
    setTistoryKeyword(keyword);
    setTistoryAiResult(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
           <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">글 제조기 Admin</h2>
           <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border mb-4 text-center" placeholder="****" />
           <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition">로그인</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen max-w-6xl">
      <SeoHelmet title="티스토리 자동 포스팅 - 관리자" />
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight flex items-center justify-center gap-3">
          <span className="text-4xl">🤖</span> 티스토리 자동 글 제조기
        </h1>
        <p className="text-slate-500 font-medium">단가가 높은 타겟 키워드를 바탕으로 고수익 창출을 위한 HTML 포스팅을 자동 생성합니다.</p>
      </div>

      {/* Categories Tab */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-2 rounded-2xl">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setTistoryKeyword(''); setTistoryAiResult(null); }}
            className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm
              \${activeCategory === cat.id 
                ? 'bg-white text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'}`}
          >
            <span className="text-lg">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Trends & Input */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-indigo-900 flex items-center gap-2">
                <span>🔥</span> 오늘의 트렌드 TOP 10
              </h2>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">매일 10시 갱신</span>
            </div>
            <p className="text-xs text-indigo-600 mb-4 font-medium leading-relaxed">
              현재 선택된 <strong className="font-bold">[{CATEGORIES.find(c => c.id === activeCategory)?.name}]</strong> 카테고리의 고단가 추천 키워드입니다. 클릭하면 자동으로 입력창에 들어갑니다.
            </p>
            
            <div className="flex flex-col gap-2">
              {todaysTrends[activeCategory].map((keyword, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendClick(keyword)}
                  className="flex items-center text-left bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 border border-transparent transition-all group"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 
                    \${index < 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{keyword}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Generator & Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-6">📝 AI 포스팅 생성</h2>
            
            <div className="flex flex-col gap-3 mb-2">
              <input 
                type="text" 
                value={tistoryKeyword}
                onChange={(e) => setTistoryKeyword(e.target.value)}
                placeholder="키워드를 입력하거나 좌측 트렌드를 클릭하세요."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-bold text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateTistoryAi()}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  placeholder="전면광고 유도 버튼 링크 (비워두면 기본값 '/m' 적용)"
                  className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-medium text-base text-blue-600"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateTistoryAi()}
                />
                <button 
                  onClick={handleGenerateTistoryAi}
                  disabled={tistoryAiLoading}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-black px-8 py-4 rounded-2xl shadow-lg transition disabled:bg-slate-300 shrink-0 text-lg flex items-center justify-center gap-2"
                >
                  {tistoryAiLoading ? '작성 중...' : '✨ 글쓰기'}
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-8 ml-2">포스팅 생성에는 약 30초~1분 정도 소요될 수 있습니다.</p>

            {tistoryAiLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-2xl border border-slate-100 animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">AI가 고단가 최적화 포스팅을 작성하고 있습니다...</h3>
                <p className="text-slate-500 font-medium text-sm">AEO 봇이 좋아하는 문맥과 구조로 구성하는 중입니다.</p>
              </div>
            )}

            {!tistoryAiLoading && tistoryAiResult && (
              <div className="space-y-6 animate-fade-in mt-8 pt-8 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-100 rounded-full opacity-50"></div>
                    <h4 className="font-black text-blue-800 mb-2 flex items-center gap-1.5 text-sm relative z-10"><span>📈</span> 키워드 분석</h4>
                    <p className="text-xs text-blue-900 leading-relaxed font-medium relative z-10">{tistoryAiResult.keywordAnalysis}</p>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-100 rounded-full opacity-50"></div>
                    <h4 className="font-black text-emerald-800 mb-2 flex items-center gap-1.5 text-sm relative z-10"><span>🤖</span> AEO 최적화</h4>
                    <p className="text-xs text-emerald-900 leading-relaxed font-medium relative z-10">{tistoryAiResult.aeoStrategy}</p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-100 rounded-full opacity-50"></div>
                    <h4 className="font-black text-amber-800 mb-2 flex items-center gap-1.5 text-sm relative z-10"><span>💰</span> 광고 배치</h4>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium relative z-10">{tistoryAiResult.adPlacementGuide}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-green-200 shadow-sm">
                    <span>⚡</span> 구글 자동 색인 (JSON-LD) 탑재 완료
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-orange-200 shadow-sm">
                    <span>💸</span> 전면광고 유도 버튼 삽입 완료
                  </span>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h4 className="font-black text-slate-800 mb-2 text-sm">📌 포스팅 제목 추천</h4>
                  <div className="bg-white p-3 rounded-xl font-bold text-slate-800 border border-slate-100 shadow-sm">
                    {tistoryAiResult.title}
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                    <div>
                      <h4 className="font-black text-slate-800 flex items-center gap-2">
                        💻 티스토리 HTML 본문
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">티스토리 글쓰기 에디터 우측 상단의 '기본모드'를 'HTML'로 변경 후 붙여넣으세요.</p>
                    </div>
                    <button onClick={handleCopyTistoryAiHtml} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black shadow-md transition whitespace-nowrap">
                      📋 1초 복사하기
                    </button>
                  </div>
                  <textarea 
                    readOnly 
                    value={tistoryAiResult.htmlContent} 
                    className="w-full h-96 p-5 bg-slate-900 text-emerald-400 font-mono text-sm rounded-xl outline-none shadow-inner resize-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}
