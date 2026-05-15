import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateTistoryPost(keyword, targetLink = '/m') {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const prompt = `
# Role
당신은 구글 애드센스 수익 극대화 전략에 정통한 **'고단가 SEO 전문 카피라이터이자 수익화 컨설턴트'**입니다. 
사용자가 제공하는 주제를 바탕으로 월 1,000만 원 수익 달성을 위한 최적의 포스팅 초안과 전략을 제공합니다.

# Core Objective
1. **고단가(High CPC) 타겟팅**: 광고주가 선호하는 금융, IT, 건강 등 전문 분야의 키워드를 전략적으로 배치합니다.
2. **구조적 SEO & 자동 색인**: 구글 봇이 문서의 위계를 명확히 파악할 수 있도록 H2, H3 태그를 구조화하고, **JSON-LD 스크립트**를 생성하여 검색 포털이 글을 즉각 색인(Index)하도록 돕습니다.
3. **AEO(Answer Engine Optimization) 최적화**: 퍼플렉시티, 챗GPT, 구글 SGE 등 AI 검색 엔진이 답변을 바로 추출할 수 있도록 직관적이고 명확한 답변 구조를 설계합니다.
4. **전면광고 수익 극대화**: 사용자가 무조건 클릭할 수밖에 없는 **전면광고 유도용 내부 링크 버튼**을 본문 중/하단에 배치하여 수익을 극대화합니다.
5. **체류시간 극대화**: 사용자가 정보를 끝까지 읽도록 유도하여 체류시간을 극대화하고 하단 광고 도달률 및 클릭률(CTR)을 높입니다.

# Guidelines for Writing
1. **문체**: 신뢰감을 주는 '~습니다', '~합니다' 등의 다나까체를 기본으로 사용하며, 전문적인 톤을 유지합니다.
2. **글자 수**: 최소 1,500자 이상의 풍부한 정보량을 기본 원칙으로 합니다.
3. **구조 (AEO, SEO, CTR 결합)**:
   - [자동 색인 JSON-LD]: HTML 코드 **최상단**에 구글 검색엔진이 좋아하는 \`<script type="application/ld+json"> ... </script>\` 형식의 Article 스키마 데이터를 완벽히 작성하여 삽입합니다. (headline, description, datePublished 등 포함)
   - [제목]: 클릭을 부르는 '숫자'와 '혜택'이 포함된 매력적인 제목 (예: "${currentYear}년 ~ 조건 3가지")
   - [서론]: 독자의 문제(Pain Point)에 깊이 공감하고, 이 글을 통해 확실한 해결책을 얻을 수 있음을 암시하는 후킹(Hooking) 문장으로 초반 이탈률을 방지하세요.
   - [AEO 다이렉트 답변]: 서론 직후, 독자가 가장 궁금해할 핵심 질문에 대한 결론을 1~2문장으로 명확히 제시 (AI 스니펫 용)
   - [본문]: 최소 3개 이상의 소제목(H2, H3)으로 구분된 논리적 설명. 데이터 신뢰도를 높이는 표(Table) 적극 활용. 본문 중간중간 작성자가 이미지를 첨부하기 좋은 위치에 \`<!-- 여기에 [이해를 돕는 LTV 계산 예시] 이미지를 삽입하세요 -->\` 형태의 HTML 주석으로 이미지 삽입 가이드를 남겨주세요.
   - [전면광고 유도 링크 버튼]: 본문 흐름상 독자가 가장 궁금해할 타이밍(예: 지원금 조회, 한도 확인, 내 조건 알아보기 등)에 **시각적으로 돋보이는 커다란 <a> 태그 버튼**을 넣으세요. 버튼 클릭 시 애드센스 전면광고가 뜰 확률을 높이기 위한 장치입니다. (예: \`<div style="text-align:center; margin: 40px 0;"><a href="${targetLink}" style="display:inline-block; padding:18px 40px; background:#2563eb; color:#fff; font-size:18px; font-weight:bold; border-radius:12px; text-decoration:none; box-shadow:0 4px 6px rgba(0,0,0,0.1);">👉 내 예상 지원금/환급금 1분 만에 조회하기</a></div>\`)
   - [애드센스 중간 광고]: 본문 소제목(H2, H3) 사이나 단락과 단락 사이 등 문맥이 전환되는 시점에 아래 2개의 애드센스 코드를 각각 최소 1회 이상 삽입하세요.
     (광고 코드 1 - 디스플레이)
     \`\`\`html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
     <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-4969939875697438" data-ad-slot="6601142958" data-ad-format="auto" data-full-width-responsive="true"></ins>
     <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
     \`\`\`
     (광고 코드 2 - 인피드)
     \`\`\`html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
     <ins class="adsbygoogle" style="display:block" data-ad-format="fluid" data-ad-layout-key="-hv-h+25-5w+88" data-ad-client="ca-pub-4969939875697438" data-ad-slot="1636074930"></ins>
     <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
     \`\`\`
   - [애드센스 자동 광고]: HTML 코드 최상단(JSON-LD 스크립트 바로 아래)에 아래 자동 광고 스크립트를 1회 반드시 삽입하세요.
     \`\`\`html
     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
     \`\`\`
   - [AEO FAQ 세션]: 글 하단에 사용자가 실제로 검색할 법한 질문 3~5개를 Q&A 형식으로 작성.
   - [결론]: 내용을 요약하고 독자에게 추가 행동 유도

# Target
- **3050 타겟 블로그 운영 전략**
- 언어의 변화: 딱딱한 전문 용어를 3050 여성이 쉽게 공감하고 이해할 수 있는 일상 언어로 완벽히 변환합니다. (예: "주택담보대출 LTV 규제 완화" -> "우리 집 대출, 지금 갈아타면 얼마나 아낄 수 있을까? 주부도 이해하는 LTV 정리")
- 고단가 키워드를 본문 전체에 자연스럽게 녹여냅니다.

# Freshness Constraint
- **현재 시점: ${currentYear}년 ${currentMonth}월**
- **모든 정보는 반드시 현재 시점(${currentYear}년)의 최신 정책, 정부 발표, 법규, 시장 트렌드를 반영하여 작성하세요.**

# Constraint
- 타인의 글을 그대로 복사하는 스크랩 방식 지양. 독자에게 실질적인 도움을 주는 '정보성 가치' 최우선.
- 지나치게 자극적인 낚시성 제목은 피하되 매력적으로 작성할 것.
- **[E-E-A-T 전문성 및 YMYL 안전 가이드]**: 금융, 건강, 법률 등 YMYL 분야는 구글의 E-E-A-T 기준을 엄격히 적용하여 공공기관 보도자료나 논문 등 공식 출처를 명시하세요. 특히 건강 주제의 경우 직접적인 치료법/의학적 진단 제시는 블로그 지수에 악영향을 주므로 절대 피하고, '식단', '영양제 성분 분석', '일상 속 운동법', '병원 이용 팁' 등 안전한 **생활건강(Lifestyle Health)** 정보로 우회하여 작성하세요.

사용자가 제공한 키워드(주제): "${keyword}"

위 가이드라인에 따라 완벽하게 구조화된 '티스토리용 HTML 본문'과 전략을 분석해주세요.
마크다운 코드 블록 없이 순수 JSON 형식으로만 정확히 반환하세요.

{
  "keywordAnalysis": "해당 키워드의 ${currentYear}년 예상 CPC 수준, 공략 세부 키워드 제안",
  "aeoStrategy": "AI 검색 엔진(AEO)에 노출되기 위한 해당 글의 핵심 답변 요약 전략",
  "adPlacementGuide": "전면광고 유도 버튼의 효과적인 배치 위치 및 유도 문구 팁",
  "title": "클릭을 유발하는 고단가 최적화 제목",
  "htmlContent": "<h1>제외, <h2>부터 시작하는 티스토리 블로그 본문 HTML 내용 전체. 반드시 최상단에 <script type='application/ld+json'> 형태의 구글 자동 색인 구조화 데이터와 함께 애드센스 자동 광고 스크립트를 포함할 것. 글 중간에 제공된 애드센스 광고 코드 2가지를 적절히 배치할 것. 글 중/하단에 시선을 확 사로잡는 화려한 CSS 스타일의 <a href='${targetLink}'> 형태 전면광고 유도 버튼을 최소 1개 이상 반드시 삽입할 것. 본문 길이는 매우 길게(1500자 이상) 작성할 것."
}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Tistory AI Generation Error:', error);
    throw error;
  }
}

export async function recommendImageAndLink(keyword) {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `
당신은 구글 애드센스 및 제휴 마케팅 전문가입니다.
사용자가 티스토리 블로그에 포스팅할 키워드(주제)를 주면, 해당 포스팅에서 수익을 극대화하기 위해 어떤 "이미지"를 삽입하고 어떤 "전면광고 유도 버튼 링크(제휴 링크 등)"를 연결하면 좋을지 3-4문장으로 짧고 명확하게 추천해주세요.

사용자 키워드: "${keyword}"

답변 형식 예시:
- 추천 이미지: 지원금 지급액 표, 건강보험료 모의계산 화면 캡처 등 독자의 시선을 끄는 정보성 이미지
- 추천 링크: 정부24 지원금 조회 페이지, 또는 쿠팡 파트너스 건강영양제 기획전 링크를 연결하여 직접적인 행동을 유도하세요.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Recommendation Error:', error);
    throw error;
  }
}
