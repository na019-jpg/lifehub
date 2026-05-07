import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateTistoryPost(keyword) {
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
2. **구조적 SEO**: 구글 봇이 문서의 위계를 명확히 파악할 수 있도록 H2, H3 태그를 구조화합니다.
3. **체류시간 극대화**: 사용자가 정보를 끝까지 읽도록 유도하여 광고 노출 및 클릭률(CTR)을 높입니다.

# Guidelines for Writing
1. **문체**: 신뢰감을 주는 '~습니다', '~합니다' 등의 다나까체를 기본으로 사용하며, 전문적인 톤을 유지합니다.
2. **글자 수**: 최소 1,500자 이상의 풍부한 정보량을 기본 원칙으로 합니다.
3. **구조**:
   - [제목]: 클릭을 부르는 '숫자'와 '혜택'이 포함된 매력적인 제목 (예: "${currentYear}년 ~ 조건 3가지")
   - [서론]: 핵심 키워드를 포함하여 독자의 문제를 공감하고 해결책을 제시함을 암시
   - [본문]: 최소 3개 이상의 소제목(H2, H3)으로 구분된 논리적 설명
   - [결론]: 내용을 요약하고 독자에게 추가 행동 유도
4. **이미지/차트 가이드**: 글 중간에 삽입하면 좋을 이미지 설명이나 표(Table) 구성을 HTML 안에 포함합니다.

# Target
- **3050 여성 타겟 블로그 운영 전략**
- 언어의 변화: 딱딱한 용어(예: "주택담보대출 LTV 규제 완화") 대신 3050 여성이 공감할 수 있는 언어(예: "우리 집 대출, 지금 갈아타면 얼마나 아낄 수 있을까?")로 풀어냅니다.
- 고단가 키워드(부동산, 자녀 교육, 부모님 건강, 주거 안정 등)를 본문 전체에 자연스럽게 녹여냅니다.

# Freshness Constraint
- **현재 시점: ${currentYear}년 ${currentMonth}월**
- **모든 정보는 반드시 현재 시점(${currentYear}년)의 최신 정책, 정부 발표, 법규, 시장 트렌드를 반영하여 작성하세요.**
- 과거 정보가 아닌, 지금 바로 독자들에게 적용 가능한 가장 따끈따끈한 정보를 제공하는 것이 핵심입니다.

# Constraint
- 타인의 글을 그대로 복사하는 스크랩 방식 지양. 독자에게 실질적인 도움을 주는 '정보성 가치' 최우선.
- 지나치게 자극적인 낚시성 제목은 피하되 매력적으로 작성할 것.

사용자가 제공한 키워드(주제): "${keyword}"

위 가이드라인에 따라 완벽하게 구조화된 '티스토리용 HTML 본문'과 전략을 분석해주세요.
마크다운 코드 블록 없이 순수 JSON 형식으로만 정확히 반환하세요.

{
  "keywordAnalysis": "해당 키워드의 ${currentYear}년 예상 CPC 수준, 공략 세부 키워드 제안",
  "adPlacementGuide": "글 내에서 광고 클릭률(CTR)이 가장 높을 것으로 예상되는 위치 및 형태 조언",
  "title": "클릭을 유발하는 고단가 최적화 제목",
  "htmlContent": "<h1>제외, <h2>부터 시작하는 티스토리 블로그 본문 전체 HTML 내용 (1500자 이상). <h2>, <h3>, <table>, <ul>, <strong> 등을 적극 사용하여 아주 풍성하고 길게 작성하세요. 글 중간중간에 [🖼️ 추천 이미지: 어떤 이미지] 또는 [💰 추천 광고 배치: 어떤 형태] 같은 텍스트 가이드도 넣어주세요."
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
