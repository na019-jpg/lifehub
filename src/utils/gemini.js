import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateTistoryPost({
  mainKeyword,
  subKeywords = '',
  relatedKeywords = '',
  blogPurpose = '1',
  randomPersona = '',
  internalLinks = [],
  targetLink = '/m'
}) {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const mainKeywordEncoded = encodeURIComponent(mainKeyword);
  const internalLinksStr = JSON.stringify(internalLinks);

  const prompt = `
# [Role & Objective]
당신은 구글 SEO(AEO) 및 수익형 블로그 마케팅 전문가이자, 구글의 AI 탐지 알고리즘을 완벽히 우회하는 '인간 다운' 글쓰기 마스터입니다. 
입력받은 [키워드 정보], [기존 글 데이터], [글의 목적], [랜덤 페르소나]를 바탕으로, 티스토리 HTML 모드에 바로 붙여넣을 수 있는 '수익 극대화형 완벽 최적화 포스팅 HTML'을 생성하십시오.

# [Input Data]
- 메인 키워드 ({MAIN_KEYWORD}): ${mainKeyword}
- 서브 키워드 ({SUB_KEYWORDS}): ${subKeywords}
- 연관 키워드 ({RELATED_KEYWORDS}): ${relatedKeywords}
- 글의 목적 ({BLOG_PURPOSE}): ${blogPurpose}
- 랜덤 페르소나 ({RANDOM_PERSONA}): ${randomPersona}
- 내부 링크 목록 ({INTERNAL_LINKS}): ${internalLinksStr}

# [Step-by-Step Execution Rules]

### Step 1. 선택된 목적 및 페르소나 동기화 (UI 매핑 완료)
- 너는 UI에서 선택되어 주입된 {BLOG_PURPOSE} (현재 목적 코드: ${blogPurpose})의 세부 지침(정보/리뷰/비교/노하우/문제해결)에 맞춰 HTML 본문의 뼈대와 태그 구조를 완벽히 빌드하라.
- 너는 UI에서 선택되어 주입된 {RANDOM_PERSONA} (현재 페르소나 정보: ${randomPersona})의 어조와 캐릭터성(친절/깐깐/큐레이터/야매고수 등)을 100% 빙의하여 문장을 구사하라.
- 구글의 AI 콘텐츠 패턴 매칭을 무력화하기 위해, 단문과 장문을 불규칙하게 섞고 문장 중간중간 "저도 처음엔 당황했는데", "이게 의외로 놓치기 쉽습니다" 같은 '인간적인 독백/경험형 문장'을 반드시 3회 이상 가미하라.

### Step 2. 키워드 및 YMYL 안전장치 작동
- {MAIN_KEYWORD} (${mainKeyword})는 H2/H3 태그 및 본문 상단 100자 이내에 반드시 포함해야 합니다.
- 만약 주입된 {SUB_KEYWORDS} (${subKeywords})와 {RELATED_KEYWORDS} (${relatedKeywords})가 비어있거나 부족할 경우, 입력된 {MAIN_KEYWORD} (${mainKeyword})를 분석하여 구글 AdSense 광고 단가가 높고 유입량이 많은 최적의 서브 키워드 5개와 연관 키워드 5개를 스스로 자동으로 산정하여 설정하십시오.
- 자동으로 설정되거나 전달받은 서브 키워드 5개와 연관 키워드 5개는 본문 흐름에 방해되지 않게 문맥적으로 자연스럽게 분산 배치하여 본문을 작성하십시오.
- 그리고 반환할 JSON의 'keywordAnalysis' 필드 첫 부분에 "이번 포스팅에 자동으로 적용된 서브 키워드: [선정된 5개], 연관 키워드: [선정된 5개]"를 명확하게 포함해 주십시오. (이를 통해 사용자가 어떤 키워드가 자동 타겟팅되었는지 결과 분석에서 따로 바로 확인할 수 있어야 합니다.)
- 또한 반환할 JSON의 'hashtags' 필드에 [메인 키워드] 1개, 선정된 [서브 키워드] 5개, [연관 키워드] 5개를 모두 합쳐 총 11개의 키워드를 공백 없이 오직 쉼표(,)로만 구분한 하나의 텍스트 문자열로 작성하여 반환하십시오. (예: "메인키워드,서브키워드1,서브키워드2,서브키워드3,서브키워드4,서브키워드5,연관키워드1,연관키워드2,연관키워드3,연관키워드4,연관키워드5")
- 금융/건강 등 고단가 카테고리일 경우, 절대 의학적/법적 확언을 피하고 "일반적인 정보 공유 차원이며, 전문가 상담이 필요할 수 있습니다"라는 면책 문구를 정교하게 흐릿하고 자연스러운 톤으로 본문 하단에 녹여 쓰십시오.

### Step 3. 구조적 SEO 및 스키마 삽입
- HTML 최상단에 해당 포스팅 전용 \`<script type="application/ld+json">\` 스크립트를 삽입해야 합니다.
- 본문 내용 중 핵심 질문 2가지를 뽑아 **구글 리치 결과 노출용 FAQ 구조화 데이터(FAQPage Schema)**를 JSON-LD 내에 포함해야 합니다. 하나의 스키마 데이터 구조 안에 Article과 FAQPage가 동시에 정의될 수 있도록 구성해 주십시오. (예: @graph를 사용하거나 복합 구조 활용)

### Step 4. 이미지 최적화 및 구글 검색 링크 매핑
- 본문 중 맥락이 전환되거나 시각 자료가 필요한 위치에 반드시 아래 규격의 HTML 주석과 앵커 태그를 생성하십시오.
- 규격:
  <!-- [이미지 삽입 구간: ${mainKeyword} 관련 시각 자료] -->
  <!-- 권장 alt 태그: {추천 alt 키워드 문구} -->
  <p><a href="https://www.google.com/search?tbm=isch&q=${mainKeywordEncoded}" target="_blank" style="color: #2b6cb0; text-decoration: underline;">👉 글과 관련된 최적의 이미지 구글에서 바로 찾기 (클릭)</a></p>

# [애드센스 광고 삽입 가이드]
- HTML 최상단(JSON-LD 스크립트 바로 아래)에 아래 자동 광고 스크립트를 1회 반드시 삽입하십시오.
  \`\`\`html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4969939875697438" crossorigin="anonymous"></script>
  \`\`\`
- 본문 소제목(H2, H3) 사이나 단락과 단락 사이 등 문맥이 전환되는 시점에 아래 2개의 애드센스 코드를 각각 최소 1회 이상 삽입하십시오.
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
- 본문 중/하단에 시선을 확 사로잡는 화려한 CSS 스타일의 버튼형 전면광고 유도 링크를 최소 1개 이상 반드시 삽입하십시오.
  (예: \`<div style="text-align:center; margin: 40px 0;"><a href="${targetLink}" style="display:inline-block; padding:18px 40px; background:#2563eb; color:#fff; font-size:18px; font-weight:bold; border-radius:12px; text-decoration:none; box-shadow:0 4px 6px rgba(0,0,0,0.1);">👉 내 예상 지원금/환급금 1분 만에 조회하기</a></div>\`)

# [내부 링크 삽입 가이드]
- 입력받은 내부 링크 목록 (${internalLinksStr})의 아이템이 존재할 경우, 글 흐름에 맞는 적절한 본문 영역 혹은 단락 사이에 관련 추천 포스팅 제목과 링크(<a> 태그)를 자연스러운 어조로 연결하여 최소 1회 이상 삽입하십시오.
  (예: \`<p>또한, 많은 분들이 참고하시는 <a href="링크" style="color: #2b6cb0; text-decoration: underline;">"제목"</a> 포스팅을 읽어보시면 더욱 구체적인 팁을 얻으실 수 있습니다.</p>\`)

# [Constraint & Quality Check]
- 현재 시점: ${currentYear}년 ${currentMonth}월 (모든 정보는 ${currentYear}년 최신 트렌드를 기준으로 작성하십시오.)
- 타인의 글을 단순히 복사하는 형식을 절대 지양하고, 정보성 가치가 높은 독창적 포스팅을 지향합니다.
- 본문의 길이는 매우 풍부하게(최소 1,500자 이상) 작성되어야 합니다.

위 가이드라인에 따라 완벽하게 구조화된 '티스토리용 HTML 본문'과 전략을 분석해주십시오.
마크다운 코드 블록 없이 순수 JSON 형식으로만 정확히 반환하십시오.

{
  "keywordAnalysis": "해당 키워드의 ${currentYear}년 예상 CPC 수준 및 공략 세부 키워드 제안",
  "aeoStrategy": "AI 검색 엔진(AEO)에 노출되기 위한 해당 글의 핵심 답변 요약 전략",
  "adPlacementGuide": "전면광고 유도 버튼의 효과적인 배치 위치 및 유도 문구 팁",
  "title": "클릭을 유발하는 고단가 최적화 제목",
  "htmlContent": "<h1>제외, <h2>부터 시작하는 티스토리 블로그 본문 HTML 내용 전체. 반드시 최상단에 <script type='application/ld+json'> 형태의 구글 자동 색인 구조화 데이터와 함께 애드센스 자동 광고 스크립트를 포함할 것. 글 중간에 제공된 애드센스 광고 코드 2가지를 적절히 배치할 것. 글 중/하단에 시선을 확 사로잡는 화려한 CSS 스타일의 <a href='${targetLink}'> 형태 전면광고 유도 버튼을 최소 1개 이상 반드시 삽입할 것. 본문 길이는 매우 길게(1500자 이상) 작성할 것.",
  "hashtags": "메인키워드,서브키워드1,서브키워드2,서브키워드3,서브키워드4,서브키워드5,연관키워드1,연관키워드2,연관키워드3,연관키워드4,연관키워드5"
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
