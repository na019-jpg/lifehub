import React, { useState, useEffect } from 'react';
import SeoHelmet from '../components/SeoHelmet';
import { generateTistoryPost, recommendImageAndLink } from '../utils/gemini';

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
  { id: 'health', name: '생활건강/영양제/운동', icon: '🌿' }
];

const PERSONA_TEMPLATES = [
  "30대 직장인 육아맘의 친근하고 정보력이 돋보이는 말투 (~했네요, ~더라고요)",
  "20대 후반 재테크 전문 유튜버의 시원시원하고 직설적인 조언 톤 (~입니다, ~하세요)",
  "40대 은행 자산관리사(PB) 출신의 신뢰감 있고 격식 있는 보고서 스타일 (~사료됩니다, ~권장합니다)",
  "10년 차 IT 테크 블로거의 꼼꼼하고 기술적이며 위트 있는 존댓말 말투 (~이죠, ~해보세요)",
  "은퇴 후 귀농하여 여유를 즐기는 50대 은퇴자의 따뜻하고 차분한 조언 말투 (~했답니다, ~하더군요)",
  "맛집/여행 블로그를 5년째 운영하는 프로 인플루언서의 통통 튀고 이모티콘을 곁들인 말투 (~!!, ~네요)",
  "대학병원 간호사 출신 헬스케어 크리에이터의 꼼꼼하고 전문적이지만 친근한 말투 (~하셔야 해요, ~입니다)",
  "스타트업 창업자의 도전적이고 트렌디하며 인사이트를 주는 어조 (~하죠, ~전망합니다)",
  "현직 공인중개사의 친절하고 현실적이며 리스크를 짚어주는 어조 (~추천해 드려요, ~조심하셔야 합니다)"
];

const BLOG_PURPOSES = [
  { value: '1', name: 'ℹ️ 정보전달', desc: '객관적 사실, 인과관계 명확, 요약 강조' },
  { value: '2', name: '⭐ 후기/리뷰', desc: '주관적 만족도, 장단점 균형, 실제 사용감 묘사' },
  { value: '3', name: '📊 비교/추천', desc: '대조 표(Table) 활용, 타겟별 추천 분기' },
  { value: '4', name: '💡 노하우/꿀팁', desc: '단계별 가이드(Step), 주의사항, 실전 팁' },
  { value: '5', name: '🛠️ 문제해결', desc: '증상/문제 원인 분석 -> 명확한 해결책 제시' }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('finance');
  const [tistoryKeyword, setTistoryKeyword] = useState('');
  const [targetLink, setTargetLink] = useState('/m');
  const [tistoryAiLoading, setTistoryAiLoading] = useState(false);
  const [tistoryAiResult, setTistoryAiResult] = useState(null);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);

  // 새롭게 추가된 고급 SEO 설정 상태들
  const [subKeywords, setSubKeywords] = useState('');
  const [relatedKeywords, setRelatedKeywords] = useState('');
  const [blogPurpose, setBlogPurpose] = useState('1');
  const [randomPersona, setRandomPersona] = useState('');
  const [internalLinks, setInternalLinks] = useState([{ title: '', url: '' }]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      setTrendsLoading(true);
      setTrendingKeywords([]);
      try {
        const keywords = TREND_DATA[activeCategory];
        const res = await fetch('/api/naver-trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keywords })
        });
        const data = await res.json();
        if (data.trends) {
          setTrendingKeywords(data.trends.slice(0, 10));
        } else {
          throw new Error(data.error || 'Failed to fetch trends');
        }
      } catch (err) {
        console.error('Naver API failed, falling back to mock:', err);
        setTrendingKeywords(TREND_DATA[activeCategory].slice(0, 10));
      } finally {
        setTrendsLoading(false);
      }
    };
    fetchTrends();
  }, [activeCategory]);

  const handleLogin = (e) => {
    e.preventDefault();
    const securePassword = import.meta.env.VITE_ADMIN_PASSWORD || '0000';
    if (password === securePassword) setIsAuthenticated(true);
    else alert('비밀번호가 일치하지 않습니다.');
  };

  const handleGetRecommendation = async () => {
    if (!tistoryKeyword.trim()) {
      alert('키워드를 먼저 입력해주세요.');
      return;
    }
    setRecommendLoading(true);
    setRecommendationResult(null);
    try {
      const result = await recommendImageAndLink(tistoryKeyword);
      setRecommendationResult(result);
    } catch (err) {
      alert("추천 실패: " + err.message);
    } finally {
      setRecommendLoading(false);
    }
  };

  const handleGenerateTistoryAi = async () => {
    if (!tistoryKeyword.trim()) {
      alert('메인 키워드를 입력해주세요.');
      return;
    }
    setTistoryAiLoading(true);
    setTistoryAiResult(null);
    try {
      const filteredInternalLinks = internalLinks.filter(link => link.title.trim() && link.url.trim());
      const result = await generateTistoryPost({
        mainKeyword: tistoryKeyword,
        subKeywords,
        relatedKeywords,
        blogPurpose,
        randomPersona,
        internalLinks: filteredInternalLinks,
        targetLink: targetLink || '/m'
      });
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
      alert("✅ 티스토리용 최적화 HTML이 복사되었습니다!\n티스토리 기본모드를 HTML로 변경하고 붙여넣기 하세요.");
    }).catch(err => alert("복사 실패: " + err));
  };

  const handleTrendClick = (keyword) => {
    setTistoryKeyword(keyword);
    setSubKeywords('');
    setRelatedKeywords('');
    setTistoryAiResult(null);
  };

  const handleRandomizePersona = () => {
    const randomIndex = Math.floor(Math.random() * PERSONA_TEMPLATES.length);
    setRandomPersona(PERSONA_TEMPLATES[randomIndex]);
  };

  const handleAddInternalLink = () => {
    setInternalLinks([...internalLinks, { title: '', url: '' }]);
  };

  const handleRemoveInternalLink = (index) => {
    const newLinks = internalLinks.filter((_, i) => i !== index);
    setInternalLinks(newLinks.length > 0 ? newLinks : [{ title: '', url: '' }]);
  };

  const handleInternalLinkChange = (index, field, value) => {
    const newLinks = [...internalLinks];
    newLinks[index][field] = value;
    setInternalLinks(newLinks);
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
              현재 선택된 <strong className="font-bold">[{CATEGORIES.find(c => c.id === activeCategory)?.name}]</strong> 카테고리의 실제 네이버 급상승 키워드입니다. (최근 14일 기준)
            </p>
            
            <div className="flex flex-col gap-2 min-h-[400px]">
              {trendsLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-10 opacity-60">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-xs font-bold text-indigo-700">네이버 검색량 분석 중...</p>
                </div>
              ) : (
                trendingKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => handleTrendClick(keyword)}
                    className="flex items-center text-left bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 border border-transparent transition-all group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 
                      ${index < 3 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors flex-1">{keyword}</span>
                    {index < 3 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">HOT</span>}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Generator & Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span>📝</span> AI 포스팅 생성
            </h2>
            
            <div className="space-y-6">
              {/* 기본 설정 섹션 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full"></span> 기본 설정
                </h3>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">메인 키워드 (필수)</label>
                    <input 
                      type="text" 
                      value={tistoryKeyword}
                      onChange={(e) => setTistoryKeyword(e.target.value)}
                      placeholder="예: 청년도약계좌 조건"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-bold text-base shadow-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateTistoryAi()}
                    />
                  </div>
                  <div className="md:self-end">
                    <button
                      onClick={handleGetRecommendation}
                      disabled={recommendLoading}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-5 py-4 rounded-xl transition disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center gap-2 text-sm shadow-sm border border-indigo-100"
                    >
                      {recommendLoading ? '분석 중...' : '💡 링크/이미지 추천'}
                    </button>
                  </div>
                </div>

                {recommendationResult && (
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl animate-fade-in text-xs text-indigo-900 whitespace-pre-wrap leading-relaxed shadow-sm">
                    <strong className="flex items-center gap-1 text-indigo-700 mb-1.5"><span className="text-sm">💡</span> AI 전략 추천</strong>
                    {recommendationResult}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">전면광고 유도 버튼 링크</label>
                  <input 
                    type="text" 
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    placeholder="비워두면 기본값 '/m' 적용 (예: 특정 랜딩페이지 URL)"
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-medium text-sm text-blue-600 shadow-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateTistoryAi()}
                  />
                </div>
              </div>

              {/* 고급 SEO 설정 (아코디언) */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-between font-bold text-slate-700 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span>⚙️</span> 구글 SEO 우회 및 포스팅 정밀 설정 {showAdvancedSettings ? '(접기)' : '(펼치기)'}
                  </span>
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 font-extrabold">
                    {showAdvancedSettings ? '▲ Close' : '▼ Expand'}
                  </span>
                </button>

                {showAdvancedSettings && (
                  <div className="p-6 bg-white border-t border-slate-100 space-y-6 animate-fade-in">
                    {/* 서브 및 연관 키워드 입력 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">서브 키워드 (5개, 쉼표 구분)</label>
                        <input 
                          type="text" 
                          value={subKeywords}
                          onChange={(e) => setSubKeywords(e.target.value)}
                          placeholder="예: 신청방법, 가입 조건, 금리 비교, 혜택, 구비서류"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">연관 키워드 (5개, 쉼표 구분)</label>
                        <input 
                          type="text" 
                          value={relatedKeywords}
                          onChange={(e) => setRelatedKeywords(e.target.value)}
                          placeholder="예: 청년통장, 적금 추천, 비과세 혜택, 모바일 신청, 하나은행"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* 글의 목적 선택 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">글의 목적 (논리 구조 동기화)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                        {BLOG_PURPOSES.map((purpose) => (
                          <button
                            key={purpose.value}
                            type="button"
                            onClick={() => setBlogPurpose(purpose.value)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24
                              ${blogPurpose === purpose.value 
                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-100 shadow-sm' 
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}
                          >
                            <span className="font-extrabold text-sm text-slate-800">{purpose.name}</span>
                            <span className="text-[10px] text-slate-500 leading-tight mt-1">{purpose.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 랜덤 페르소나 설정 */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-500">랜덤 페르소나 (AI 탐지 우회 말투)</label>
                        <button
                          type="button"
                          onClick={handleRandomizePersona}
                          className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 shadow-sm"
                        >
                          <span>🎲</span> 랜덤 페르소나 부여
                        </button>
                      </div>
                      <textarea 
                        value={randomPersona}
                        onChange={(e) => setRandomPersona(e.target.value)}
                        placeholder="부여할 어조나 말투를 입력하거나, 우측 🎲 버튼을 클릭하여 랜덤 템플릿을 적용해 보세요."
                        className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition text-sm font-medium resize-none"
                      />
                    </div>

                    {/* 내부 링크 목록 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-500">기존 포스팅 내부 링크 연결</label>
                        <button
                          type="button"
                          onClick={handleAddInternalLink}
                          className="text-xs font-extrabold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm"
                        >
                          <span>➕</span> 링크 추가
                        </button>
                      </div>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {internalLinks.map((link, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <input 
                              type="text" 
                              value={link.title}
                              onChange={(e) => handleInternalLinkChange(idx, 'title', e.target.value)}
                              placeholder="포스팅 제목"
                              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                            />
                            <input 
                              type="text" 
                              value={link.url}
                              onChange={(e) => handleInternalLinkChange(idx, 'url', e.target.value)}
                              placeholder="포스팅 URL"
                              className="flex-[2] px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none text-blue-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInternalLink(idx)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 transition"
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 포스팅 시작 전 설정 프리뷰 (글쓰기 전에 메인/서브 키워드 확인용) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-extrabold text-slate-500 flex items-center gap-1">
                    <span>📢</span> 포스팅 생성 설정 프리뷰
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                    Ready to Write
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-inner">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">🎯 메인 키워드</span>
                    <span className="font-black text-slate-700 text-sm">{tistoryKeyword || '(메인 키워드를 입력해주세요)'}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-inner">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">🏷️ 서브 키워드</span>
                    {subKeywords.trim() ? (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {subKeywords.split(',').map((kw, idx) => (
                          <span key={idx} className="bg-slate-50 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded border border-slate-100">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium block mt-0.5">(등록된 서브 키워드 없음)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 실행 버튼 */}
              <div className="pt-2">
                <button 
                  onClick={handleGenerateTistoryAi}
                  disabled={tistoryAiLoading}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black px-8 py-5 rounded-2xl shadow-xl transition-all hover:shadow-2xl disabled:bg-slate-300 text-lg flex items-center justify-center gap-3 active:scale-[0.99]"
                >
                  {tistoryAiLoading ? (
                    <>
                      <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>수익 극대화형 포스팅 제조 중...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>수익 극대화형 완벽 최적화 포스팅 생성</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-3 font-semibold">
                  구글 AEO(대화형 검색) 스니펫 및 애드센스 전면광고 자동 배치 완료
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-8 ml-2">포스팅 생성에는 약 30초~1분 정도 소요될 수 있습니다.</p>

            {tistoryAiLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-br from-slate-50 to-blue-50/20 rounded-2xl border border-slate-100 shadow-inner">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-black text-slate-800 mb-2">✨ AI 포스팅 자동 작성 중</h3>
                <p className="text-slate-500 font-medium text-sm mb-6">구글 SEO 최적화 및 AEO 검색 노출을 위한 최적의 구조로 글을 구성하고 있습니다.</p>
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full text-left space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider pb-1 border-b">
                    <span>Targeting Info</span>
                    <span className="text-blue-600 animate-pulse">● Generation in progress</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 block mb-0.5">🎯 메인 키워드</span>
                    <span className="font-extrabold text-slate-800 text-base">{tistoryKeyword}</span>
                  </div>
                  {subKeywords.trim() && (
                    <div>
                      <span className="text-xs font-bold text-slate-400 block mb-0.5">🏷️ 서브 키워드</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {subKeywords.split(',').map((kw, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md border border-slate-200">
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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

                {/* 메인 및 서브 키워드 확인 카드 */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                    <span>🎯</span> 타겟팅 적용 키워드
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">메인 키워드</span>
                      <span className="font-black text-slate-800 text-base">{tistoryKeyword}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-inner">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">서브 키워드</span>
                      {subKeywords.trim() ? (
                        <div className="flex flex-wrap gap-1.5">
                          {subKeywords.split(',').map((kw, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md border border-slate-200">
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">(지정된 서브 키워드 없음)</span>
                      )}
                    </div>
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
